from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from ..database import engine
from ..models import RecipientNeed
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=RecipientNeed, status_code=status.HTTP_201_CREATED)
def create_need(need: RecipientNeed, session: Session = Depends(get_session)):
    session.add(need)
    session.commit()
    session.refresh(need)
    return need

@router.get("/", response_model=List[RecipientNeed])
def list_needs(session: Session = Depends(get_session)):
    items = session.exec(select(RecipientNeed)).all()
    return items

@router.get("/{need_id}", response_model=RecipientNeed)
def get_need(need_id: int, session: Session = Depends(get_session)):
    need = session.get(RecipientNeed, need_id)
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")
    return need

@router.put("/{need_id}", response_model=RecipientNeed)
def update_need(need_id: int, updated: RecipientNeed, session: Session = Depends(get_session)):
    existing = session.get(RecipientNeed, need_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Need not found")
    update_data = updated.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing, key, value)
    session.add(existing)
    session.commit()
    session.refresh(existing)
    return existing

@router.delete("/{need_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_need(need_id: int, session: Session = Depends(get_session)):
    need = session.get(RecipientNeed, need_id)
    if not need:
        raise HTTPException(status_code=404, detail="Need not found")
    session.delete(need)
    session.commit()
    return None
