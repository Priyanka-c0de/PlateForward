from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from ..database import engine
from ..models import SurplusOffer, RecipientNeed, WasteObservation, Match
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/summary")
async def summary(session: Session = Depends(get_session)) -> Dict[str, float]:
    total_waste = session.exec(select(func.sum(WasteObservation.quantity))).first() or 0
    total_surplus = session.exec(select(func.sum(SurplusOffer.quantity))).first() or 0
    total_need = session.exec(select(func.sum(RecipientNeed.quantity))).first() or 0
    return {
        "total_waste": float(total_waste),
        "total_surplus": float(total_surplus),
        "total_need": float(total_need),
    }

@router.get("/category_breakdown")
async def category_breakdown(session: Session = Depends(get_session)) -> List[Dict[str, float]]:
    surplus_q = session.exec(
        select(SurplusOffer.food_category, func.sum(SurplusOffer.quantity))
        .group_by(SurplusOffer.food_category)
    ).all()
    need_q = session.exec(
        select(RecipientNeed.food_category, func.sum(RecipientNeed.quantity))
        .group_by(RecipientNeed.food_category)
    ).all()
    result: List[Dict[str, float]] = []
    for cat, qty in surplus_q:
        result.append({"category": cat, "surplus": float(qty), "need": 0})
    for cat, qty in need_q:
        for entry in result:
            if entry["category"] == cat:
                entry["need"] = float(qty)
                break
        else:
            result.append({"category": cat, "surplus": 0, "need": float(qty)})
    return result

@router.get("/trend")
async def trend(metric: str = "surplus", days: int = 30, session: Session = Depends(get_session)) -> List[Dict[str, float]]:
    if metric not in {"surplus", "need", "waste"}:
        raise HTTPException(status_code=400, detail="Invalid metric")
    model = {
        "surplus": SurplusOffer,
        "need": RecipientNeed,
        "waste": WasteObservation,
    }[metric]
    # Choose date column based on model
    date_attr = {
        SurplusOffer: "availability_timestamp",
        RecipientNeed: "required_date",
        WasteObservation: "observation_date",
    }[model]
    date_field = getattr(model, date_attr)
    start = datetime.utcnow().date()
    data: List[Dict[str, float]] = []
    for i in range(days):
        day = start - timedelta(days=i)
        total = session.exec(
            select(func.sum(model.quantity)).where(func.date(date_field) == day)
        ).first() or 0
        data.append({"date": day.isoformat(), "total": float(total)})
    data.reverse()
    return data
