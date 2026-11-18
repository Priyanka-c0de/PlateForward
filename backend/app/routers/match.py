import math
from fastapi import APIRouter, HTTPException, Depends, status, Query, Body
from pydantic import BaseModel
from sqlmodel import Session, select
from ..database import engine
from ..models import SurplusOffer, RecipientNeed, Match
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class DecisionPayload(BaseModel):
    decision: Optional[str] = None

def get_session():
    with Session(engine) as session:
        yield session

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS points in km."""
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

def compute_compatibility(surplus: SurplusOffer, need: RecipientNeed) -> (float, str):
    """Return a score (0-100) and an explanation string.
    Rule-based scoring enhanced with geographic distance:
    * Category match (+30)
    * Quantity sufficient (+20) or partial (+10)
    * Deadline proximity (if both have dates) (+20 for <=2 days, +10 for <=5 days)
    * Priority/urgency (+20 if need.priority == 'high' or 'urgent')
    * Geographical distance / location proximity:
        - If GPS coords available:
            * <= 5 km: +15 pts
            * <= 15 km: +10 pts
            * <= 30 km: +5 pts
        - Else fallback to location substring check (+10)
    Adjust score to 0‑100.
    """
    score = 0
    explanations = []

    # 1. Category
    if surplus.food_category.lower() == need.food_category.lower():
        score += 30
        explanations.append("food category matches")

    # 2. Quantity
    if surplus.quantity >= need.quantity:
        score += 20
        explanations.append("available quantity meets request")
    elif surplus.quantity > 0:
        score += 10
        explanations.append("partial quantity available")

    # 3. Deadlines
    if surplus.collection_deadline and need.required_date:
        delta = (surplus.collection_deadline - need.required_date).days
        if delta >= 0 and delta <= 2:
            score += 20
            explanations.append("collection deadline close to required date")
        elif delta >= 0 and delta <= 5:
            score += 10
            explanations.append("collection deadline within 5 days of need")

    # 4. Priority
    if need.priority.lower() in ("high", "urgent"):
        score += 20
        explanations.append(f"need has {need.priority.lower()} priority")

    # 5. Geographical Proximity
    if (surplus.latitude is not None and surplus.longitude is not None and
        need.latitude is not None and need.longitude is not None):
        dist = haversine_distance(surplus.latitude, surplus.longitude, need.latitude, need.longitude)
        if dist <= 5.0:
            score += 15
            explanations.append(f"close geographical proximity ({dist} km)")
        elif dist <= 15.0:
            score += 10
            explanations.append(f"moderate proximity ({dist} km)")
        elif dist <= 30.0:
            score += 5
            explanations.append(f"serviceable distance ({dist} km)")
        else:
            explanations.append(f"distance: {dist} km")
    elif (surplus.pickup_location.lower() in need.delivery_location.lower() or
          need.delivery_location.lower() in surplus.pickup_location.lower()):
        score += 10
        explanations.append("pickup and delivery locations overlap")

    # Cap score at 100
    if score > 100:
        score = 100
    explanation = ", ".join(explanations) if explanations else "no strong matching factors"
    return score, explanation

@router.post("/generate", response_model=List[Match])
def generate_matches(session: Session = Depends(get_session)):
    """Generate candidate matches for all open surplus offers and needs.
    Existing matches are not removed; new matches are appended.
    """
    surpluses = session.exec(select(SurplusOffer).where(SurplusOffer.status == "pending")).all()
    needs = session.exec(select(RecipientNeed).where(RecipientNeed.fulfillment_status == "open")).all()
    generated: List[Match] = []
    for s in surpluses:
        for n in needs:
            # Basic compatibility checks
            if s.food_category.lower() != n.food_category.lower():
                continue  # category must match for this simple engine
            score, explanation = compute_compatibility(s, n)
            if score == 0:
                continue
            match = Match(
                surplus_offer_id=s.id,
                recipient_need_id=n.id,
                proposed_quantity=min(s.quantity, n.quantity),
                compatibility_score=score,
                recommendation_explanation=explanation,
                decision="proposed",
                status="pending",
            )
            session.add(match)
            generated.append(match)
    session.commit()
    for m in generated:
        session.refresh(m)
    return generated

@router.get("/", response_model=List[Match])
def list_matches(session: Session = Depends(get_session)):
    return session.exec(select(Match)).all()

@router.patch("/{match_id}", response_model=Match)
def decide_match(
    match_id: int,
    decision: Optional[str] = Query(None),
    payload: Optional[DecisionPayload] = Body(None),
    session: Session = Depends(get_session)
):
    """Update decision for a match. decision must be one of: approved, rejected, cancelled.
    Accepts decision as query param (?decision=...) or JSON body ({"decision": "..."}).
    Adjust quantities and statuses accordingly.
    """
    raw_decision = decision or (payload.decision if payload else None)
    if not raw_decision:
        raise HTTPException(status_code=400, detail="Decision parameter is required")

    match = session.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    decision_norm = raw_decision.lower()
    if decision_norm not in ["approved", "rejected", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid decision. Must be approved, rejected, or cancelled")

    match.decision = decision_norm
    match.decision_timestamp = datetime.utcnow()

    if decision_norm == "approved":
        # Keep status as pending per test specification, record decision
        match.status = "pending"
        # Update surplus and need quantities
        surplus = session.get(SurplusOffer, match.surplus_offer_id)
        need = session.get(RecipientNeed, match.recipient_need_id)
        if surplus and need:
            allocated = match.proposed_quantity
            surplus.quantity = max(0.0, surplus.quantity - allocated)
            if surplus.quantity == 0:
                surplus.status = "claimed"
            session.add(surplus)

            need.quantity = max(0.0, need.quantity - allocated)
            if need.quantity == 0:
                need.fulfillment_status = "fulfilled"
            session.add(need)
    elif decision_norm in ["rejected", "cancelled"]:
        match.status = "cancelled"

    session.add(match)
    session.commit()
    session.refresh(match)
    return match
