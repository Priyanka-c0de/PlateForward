from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from ..database import engine
from ..models import SurplusOffer
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=SurplusOffer, status_code=status.HTTP_201_CREATED)
def create_surplus(surplus: SurplusOffer, session: Session = Depends(get_session)):
    session.add(surplus)
    session.commit()
    session.refresh(surplus)
    return surplus

@router.get("/", response_model=List[SurplusOffer])
def list_surpluses(session: Session = Depends(get_session)):
    items = session.exec(select(SurplusOffer)).all()
    return items

@router.get("/{surplus_id}", response_model=SurplusOffer)
def get_surplus(surplus_id: int, session: Session = Depends(get_session)):
    surplus = session.get(SurplusOffer, surplus_id)
    if not surplus:
        raise HTTPException(status_code=404, detail="Surplus not found")
    return surplus

@router.put("/{surplus_id}", response_model=SurplusOffer)
def update_surplus(surplus_id: int, updated: SurplusOffer, session: Session = Depends(get_session)):
    existing = session.get(SurplusOffer, surplus_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Surplus not found")
    update_data = updated.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing, key, value)
    session.add(existing)
    session.commit()
    session.refresh(existing)
    return existing

@router.delete("/{surplus_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_surplus(surplus_id: int, session: Session = Depends(get_session)):
    surplus = session.get(SurplusOffer, surplus_id)
    if not surplus:
        raise HTTPException(status_code=404, detail="Surplus not found")
    session.delete(surplus)
    session.commit()
    return None
