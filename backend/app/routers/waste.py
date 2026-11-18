from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from ..database import engine
from ..models import WasteObservation
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/", response_model=WasteObservation, status_code=status.HTTP_201_CREATED)
def create_waste(obs: WasteObservation, session: Session = Depends(get_session)):
    session.add(obs)
    session.commit()
    session.refresh(obs)
    return obs

@router.get("/", response_model=List[WasteObservation])
def list_waste(session: Session = Depends(get_session)):
    items = session.exec(select(WasteObservation)).all()
    return items

@router.get("/{obs_id}", response_model=WasteObservation)
def get_waste(obs_id: int, session: Session = Depends(get_session)):
    obs = session.get(WasteObservation, obs_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    return obs

@router.delete("/{obs_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_waste(obs_id: int, session: Session = Depends(get_session)):
    obs = session.get(WasteObservation, obs_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    session.delete(obs)
    session.commit()
    return None
