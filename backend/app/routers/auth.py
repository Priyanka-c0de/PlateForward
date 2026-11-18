from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from sqlmodel import Session, select
from ..database import engine
from ..models import User
from ..auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_session,
)

router = APIRouter()

# ==============================================================================
# Pydantic Schemas
# ==============================================================================
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    role: str = "Food Recipient"  # Food Donor | Food Recipient | Administrator
    location: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: Optional[str] = None
    organization_name: Optional[str] = None
    role: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ==============================================================================
# Auth Endpoints
# ==============================================================================
@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(req: RegisterRequest, session: Session = Depends(get_session)):
    # 1. Validation
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    valid_roles = {"Food Donor", "Food Recipient", "Administrator"}
    if req.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")

    # Check email duplicate
    existing = session.exec(select(User).where(User.email == req.email.lower())).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email address already exists")

    # 2. Create User
    new_user = User(
        full_name=req.full_name.strip(),
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        phone_number=req.phone_number.strip() if req.phone_number else None,
        organization_name=req.organization_name.strip() if req.organization_name else None,
        role=req.role,
        location=req.location.strip() if req.location else "",
        latitude=req.latitude,
        longitude=req.longitude,
        is_active=True,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # 3. Create Token
    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return AuthResponse(access_token=token, user=UserResponse.model_validate(new_user))

@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == req.email.lower().strip())).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account has been deactivated. Please contact support.",
        )

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return AuthResponse(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if req.full_name is not None:
        current_user.full_name = req.full_name.strip()
    if req.phone_number is not None:
        current_user.phone_number = req.phone_number.strip()
    if req.organization_name is not None:
        current_user.organization_name = req.organization_name.strip()
    if req.location is not None:
        current_user.location = req.location.strip()
    if req.latitude is not None:
        current_user.latitude = req.latitude
    if req.longitude is not None:
        current_user.longitude = req.longitude

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == req.email.lower().strip())).first()
    # Always return a success message for security reasons
    if user:
        # In a real environment, send reset email; here acknowledge simulation
        return {"message": "Password reset instructions have been sent to your email address."}
    return {"message": "If an account exists with that email, reset instructions have been sent."}
