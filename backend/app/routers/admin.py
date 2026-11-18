from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlmodel import Session, select, func
from ..database import engine
from ..models import User, SurplusOffer, RecipientNeed, WasteObservation, Match
from ..auth import require_admin, get_session
from .auth import UserResponse

router = APIRouter()

# ==============================================================================
# Overview Stats Schema
# ==============================================================================
class DatabaseOverview(BaseModel):
    total_users: int
    total_surplus_offers: int
    total_recipient_needs: int
    total_waste_observations: int
    total_matches: int
    approved_matches: int
    rejected_matches: int
    pending_matches: int

class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    organization_name: Optional[str] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

# ==============================================================================
# Admin Endpoints (Protected by require_admin)
# ==============================================================================
@router.get("/overview", response_model=DatabaseOverview)
def get_database_overview(
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    total_users = session.exec(select(func.count(User.id))).one()
    total_surplus = session.exec(select(func.count(SurplusOffer.id))).one()
    total_needs = session.exec(select(func.count(RecipientNeed.id))).one()
    total_waste = session.exec(select(func.count(WasteObservation.id))).one()
    total_matches = session.exec(select(func.count(Match.id))).one()

    approved_matches = session.exec(select(func.count(Match.id)).where(Match.decision == "approved")).one()
    rejected_matches = session.exec(select(func.count(Match.id)).where(Match.decision == "rejected")).one()
    pending_matches = session.exec(select(func.count(Match.id)).where(Match.decision == "proposed")).one()

    return DatabaseOverview(
        total_users=total_users,
        total_surplus_offers=total_surplus,
        total_recipient_needs=total_needs,
        total_waste_observations=total_waste,
        total_matches=total_matches,
        approved_matches=approved_matches,
        rejected_matches=rejected_matches,
        pending_matches=pending_matches,
    )

@router.get("/users", response_model=List[UserResponse])
def list_admin_users(
    admin: User = Depends(require_admin),
    search: Optional[str] = None,
    role: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
):
    query = select(User)
    if role and role != "All":
        query = query.where(User.role == role)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.where(
            (func.lower(User.full_name).like(search_fmt)) |
            (func.lower(User.email).like(search_fmt)) |
            (func.lower(User.organization_name).like(search_fmt)) |
            (func.lower(User.location).like(search_fmt))
        )
    query = query.offset(offset).limit(limit)
    users = session.exec(query).all()
    return [UserResponse.model_validate(u) for u in users]

@router.put("/users/{user_id}", response_model=UserResponse)
def update_admin_user(
    user_id: int,
    req: UserUpdateRequest,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.full_name is not None:
        user.full_name = req.full_name.strip()
    if req.role is not None:
        valid_roles = {"Food Donor", "Food Recipient", "Administrator"}
        if req.role not in valid_roles:
            raise HTTPException(status_code=400, detail="Invalid role specified")
        user.role = req.role
    if req.organization_name is not None:
        user.organization_name = req.organization_name.strip()
    if req.phone_number is not None:
        user.phone_number = req.phone_number.strip()
    if req.location is not None:
        user.location = req.location.strip()
    if req.is_active is not None:
        # Prevent admin deactivating self
        if user.id == admin.id and not req.is_active:
            raise HTTPException(status_code=400, detail="You cannot deactivate your own administrator account")
        user.is_active = req.is_active

    session.add(user)
    session.commit()
    session.refresh(user)
    return UserResponse.model_validate(user)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_user(
    user_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own administrator account")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return None
