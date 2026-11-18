from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlmodel import Session, select
from ..database import engine
from ..models import SurplusOffer, RecipientNeed, WasteObservation
import pandas as pd
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

def validate_and_convert(df: pd.DataFrame, entity: str):
    """Basic validation for required columns based on entity type.
    Returns a list of model instances.
    """
    required = {
        "surplus": ["donor", "food_category", "quantity", "unit", "pickup_location"],
        "need": ["recipient_org", "food_category", "quantity", "unit", "delivery_location"],
        "waste": ["reporting_source", "food_category", "quantity", "unit", "source_location"],
    }
    cols = required.get(entity)
    if not cols:
        raise ValueError(f"Unknown entity {entity}")
    missing = [c for c in cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns for {entity}: {missing}")
    # Simple type conversion
    records = []
    for _, row in df.iterrows():
        try:
            if entity == "surplus":
                rec = SurplusOffer(
                    donor=str(row["donor"]),
                    food_category=str(row["food_category"]),
                    description=str(row.get("description", "")),
                    quantity=float(row["quantity"]),
                    unit=str(row["unit"]),
                    pickup_location=str(row["pickup_location"]),
                    status=str(row.get("status", "pending")),
                    verification_status=str(row.get("verification_status", "unverified")),
                )
            elif entity == "need":
                rec = RecipientNeed(
                    recipient_org=str(row["recipient_org"]),
                    food_category=str(row["food_category"]),
                    quantity=float(row["quantity"]),
                    unit=str(row["unit"]),
                    delivery_location=str(row["delivery_location"]),
                    priority=str(row.get("priority", "normal")),
                    verification_status=str(row.get("verification_status", "unverified")),
                )
            else:  # waste
                rec = WasteObservation(
                    reporting_source=str(row["reporting_source"]),
                    food_category=str(row["food_category"]),
                    quantity=float(row["quantity"]),
                    unit=str(row["unit"]),
                    source_location=str(row["source_location"]),
                    waste_classification=str(row.get("waste_classification", "")),
                )
            records.append(rec)
        except Exception as e:
            raise ValueError(f"Row conversion error: {e}")
    return records

@router.post("/surplus", status_code=status.HTTP_201_CREATED)
async def upload_surplus(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if file.content_type not in ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.BytesIO(contents))
        else:
            df = pd.read_excel(pd.io.common.BytesIO(contents))
        records = validate_and_convert(df, "surplus")
        for rec in records:
            session.add(rec)
        session.commit()
        return {"imported": len(records)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/need", status_code=status.HTTP_201_CREATED)
async def upload_need(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if file.content_type not in ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.BytesIO(contents))
        else:
            df = pd.read_excel(pd.io.common.BytesIO(contents))
        records = validate_and_convert(df, "need")
        for rec in records:
            session.add(rec)
        session.commit()
        return {"imported": len(records)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/waste", status_code=status.HTTP_201_CREATED)
async def upload_waste(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if file.content_type not in ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.BytesIO(contents))
        else:
            df = pd.read_excel(pd.io.common.BytesIO(contents))
        records = validate_and_convert(df, "waste")
        for rec in records:
            session.add(rec)
        session.commit()
        return {"imported": len(records)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
