from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(description="Full name of user or contact person")
    email: str = Field(unique=True, index=True, description="Login email address")
    hashed_password: str = Field(description="PBKDF2-HMAC-SHA256 hashed password")
    phone_number: Optional[str] = Field(default=None, description="Contact phone number")
    organization_name: Optional[str] = Field(default=None, description="Organization or business name")
    role: str = Field(default="Food Recipient", description="Food Donor | Food Recipient | Administrator")
    location: str = Field(default="", description="City or address")
    latitude: Optional[float] = Field(default=None, description="Latitude coordinate")
    longitude: Optional[float] = Field(default=None, description="Longitude coordinate")
    is_active: bool = Field(default=True, description="Account active status")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Account creation timestamp")

    # Relationships
    surplus_offers: List["SurplusOffer"] = Relationship(back_populates="user")
    recipient_needs: List["RecipientNeed"] = Relationship(back_populates="user")

class SurplusOffer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    donor: str = Field(index=True, description="Donor or source organization")
    food_category: str = Field(index=True, description="Standardized food category")
    description: Optional[str] = Field(default=None, description="Free‑form description of the offer")
    quantity: float = Field(description="Available quantity")
    unit: str = Field(description="Unit of measurement, e.g., kg, liters")
    availability_timestamp: Optional[datetime] = Field(default=None, description="Timestamp when food becomes available")
    collection_deadline: Optional[datetime] = Field(default=None, description="When the food must be collected")
    pickup_location: str = Field(description="Address or coordinates for collection")
    latitude: Optional[float] = Field(default=None, description="Collection latitude")
    longitude: Optional[float] = Field(default=None, description="Collection longitude")
    storage_info: Optional[str] = Field(default=None, description="Handling / storage constraints")
    status: str = Field(default="pending", description="Current processing status")
    data_source: Optional[str] = Field(default=None, description="Origin of the record, e.g., upload, manual")
    verification_status: str = Field(default="unverified", description="Verification flag")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", description="Linked donor user account")

    # Relationships
    user: Optional[User] = Relationship(back_populates="surplus_offers")
    matches: List["Match"] = Relationship(back_populates="surplus_offer")

class RecipientNeed(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recipient_org: str = Field(index=True, description="Recipient organization name")
    food_category: str = Field(index=True, description="Requested food category")
    quantity: float = Field(description="Requested quantity")
    unit: str = Field(description="Unit of measurement")
    required_date: Optional[datetime] = Field(default=None, description="Date by which food is needed")
    delivery_location: str = Field(description="Where the food should be delivered")
    latitude: Optional[float] = Field(default=None, description="Delivery latitude")
    longitude: Optional[float] = Field(default=None, description="Delivery longitude")
    priority: str = Field(default="normal", description="Urgency level")
    priority_reason: Optional[str] = Field(default=None, description="Reason for priority assignment")
    verification_status: str = Field(default="unverified", description="Verification flag")
    fulfillment_status: str = Field(default="open", description="Current fulfillment state")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", description="Linked recipient user account")

    # Relationships
    user: Optional[User] = Relationship(back_populates="recipient_needs")
    matches: List["Match"] = Relationship(back_populates="recipient_need")

class WasteObservation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reporting_source: str = Field(description="Source that reported the observation")
    food_category: str = Field(index=True, description="Food category observed")
    quantity: float = Field(description="Observed quantity")
    unit: str = Field(description="Unit of measurement")
    observation_date: Optional[datetime] = Field(default=None, description="Date of observation")
    source_location: str = Field(description="Location of the observation")
    latitude: Optional[float] = Field(default=None, description="Observation latitude")
    longitude: Optional[float] = Field(default=None, description="Observation longitude")
    waste_classification: Optional[str] = Field(default=None, description="Type of waste, e.g., avoidable")
    data_provenance: Optional[str] = Field(default=None, description="Method of data collection")

class Match(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    surplus_offer_id: int = Field(foreign_key="surplusoffer.id", description="Linked surplus offer")
    recipient_need_id: int = Field(foreign_key="recipientneed.id", description="Linked recipient need")
    proposed_quantity: float = Field(description="Quantity suggested for allocation")
    compatibility_score: Optional[float] = Field(default=None, description="Rule‑based ranking score")
    recommendation_explanation: str = Field(description="Human‑readable explanation of the recommendation")
    decision: str = Field(default="proposed", description="User decision: proposed / approved / rejected / cancelled")
    decision_timestamp: Optional[datetime] = Field(default=None, description="When the decision was recorded")
    status: str = Field(default="pending", description="Overall match status")

    surplus_offer: SurplusOffer = Relationship(back_populates="matches")
    recipient_need: RecipientNeed = Relationship(back_populates="matches")
