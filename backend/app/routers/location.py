import math
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select
from ..database import engine
from ..models import SurplusOffer, RecipientNeed
from ..auth import get_session

router = APIRouter()

# ==============================================================================
# Haversine Distance Formula
# ==============================================================================
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometres."""
    R = 6371.0  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

# ==============================================================================
# Response Schemas
# ==============================================================================
class NearbySurplusItem(BaseModel):
    id: int
    donor: str
    food_category: str
    description: Optional[str] = None
    quantity: float
    unit: str
    pickup_location: str
    latitude: float
    longitude: float
    collection_deadline: Optional[datetime] = None
    status: str
    distance_km: float

class NearbyNeedItem(BaseModel):
    id: int
    recipient_org: str
    food_category: str
    quantity: float
    unit: str
    delivery_location: str
    latitude: float
    longitude: float
    priority: str
    fulfillment_status: str
    distance_km: float

class MapMarker(BaseModel):
    id: int
    type: str  # "surplus" or "need"
    title: str
    category: str
    quantity: float
    unit: str
    location: str
    latitude: float
    longitude: float
    badge: str
    distance_km: Optional[float] = None

# ==============================================================================
# Nearby Discovery Endpoints
# ==============================================================================
@router.get("/nearby-surplus", response_model=List[NearbySurplusItem])
def get_nearby_surplus(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(25.0, ge=1.0, le=200.0, description="Search radius in kilometres"),
    category: Optional[str] = Query(None, description="Optional food category filter"),
    session: Session = Depends(get_session)
):
    query = select(SurplusOffer).where(SurplusOffer.status == "pending")
    if category and category != "All":
        query = query.where(SurplusOffer.food_category.ilike(f"%{category}%"))

    items = session.exec(query).all()
    results: List[NearbySurplusItem] = []

    for item in items:
        # Require coordinates
        if item.latitude is None or item.longitude is None:
            continue
        dist = haversine_distance(lat, lng, item.latitude, item.longitude)
        if dist <= radius_km:
            results.append(NearbySurplusItem(
                id=item.id,
                donor=item.donor,
                food_category=item.food_category,
                description=item.description,
                quantity=item.quantity,
                unit=item.unit,
                pickup_location=item.pickup_location,
                latitude=item.latitude,
                longitude=item.longitude,
                collection_deadline=item.collection_deadline,
                status=item.status,
                distance_km=dist,
            ))

    # Sort by nearest distance
    results.sort(key=lambda x: x.distance_km)
    return results

@router.get("/nearby-needs", response_model=List[NearbyNeedItem])
def get_nearby_needs(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(25.0, ge=1.0, le=200.0, description="Search radius in kilometres"),
    category: Optional[str] = Query(None, description="Optional food category filter"),
    session: Session = Depends(get_session)
):
    query = select(RecipientNeed).where(RecipientNeed.fulfillment_status == "open")
    if category and category != "All":
        query = query.where(RecipientNeed.food_category.ilike(f"%{category}%"))

    items = session.exec(query).all()
    results: List[NearbyNeedItem] = []

    for item in items:
        if item.latitude is None or item.longitude is None:
            continue
        dist = haversine_distance(lat, lng, item.latitude, item.longitude)
        if dist <= radius_km:
            results.append(NearbyNeedItem(
                id=item.id,
                recipient_org=item.recipient_org,
                food_category=item.food_category,
                quantity=item.quantity,
                unit=item.unit,
                delivery_location=item.delivery_location,
                latitude=item.latitude,
                longitude=item.longitude,
                priority=item.priority,
                fulfillment_status=item.fulfillment_status,
                distance_km=dist,
            ))

    results.sort(key=lambda x: x.distance_km)
    return results

@router.get("/all-markers", response_model=List[MapMarker])
def get_all_map_markers(
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None,
    session: Session = Depends(get_session)
):
    markers: List[MapMarker] = []

    # Active surplus offers
    surpluses = session.exec(select(SurplusOffer).where(SurplusOffer.status == "pending")).all()
    for s in surpluses:
        if s.latitude is not None and s.longitude is not None:
            dist = haversine_distance(user_lat, user_lng, s.latitude, s.longitude) if user_lat and user_lng else None
            markers.append(MapMarker(
                id=s.id,
                type="surplus",
                title=s.donor,
                category=s.food_category,
                quantity=s.quantity,
                unit=s.unit,
                location=s.pickup_location,
                latitude=s.latitude,
                longitude=s.longitude,
                badge="Available Surplus",
                distance_km=dist,
            ))

    # Active recipient needs
    needs = session.exec(select(RecipientNeed).where(RecipientNeed.fulfillment_status == "open")).all()
    for n in needs:
        if n.latitude is not None and n.longitude is not None:
            dist = haversine_distance(user_lat, user_lng, n.latitude, n.longitude) if user_lat and user_lng else None
            markers.append(MapMarker(
                id=n.id,
                type="need",
                title=n.recipient_org,
                category=n.food_category,
                quantity=n.quantity,
                unit=n.unit,
                location=n.delivery_location,
                latitude=n.latitude,
                longitude=n.longitude,
                badge=f"Need ({n.priority})",
                distance_km=dist,
            ))

    return markers
