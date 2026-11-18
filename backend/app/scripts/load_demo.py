import csv
import pathlib
from sqlmodel import Session, select
from ..database import engine
from ..models import SurplusOffer, RecipientNeed, WasteObservation

# The demo CSVs live in the top‑level ``demo_data`` directory (as documented).
PROJECT_ROOT = pathlib.Path(__file__).parents[3]
DEMO_DIR = PROJECT_ROOT / 'demo_data'

def _load_csv(path: pathlib.Path, model_cls):
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        records = []
        for row in reader:
            # Convert numeric fields
            if 'quantity' in row:
                row['quantity'] = float(row['quantity'])
            # Strip whitespace
            cleaned = {k: v.strip() if isinstance(v, str) else v for k, v in row.items()}
            records.append(model_cls(**cleaned))
    return records

def load_demo(overwrite: bool = False):
    with Session(engine) as session:
        # Surplus offers
        surplus_path = DEMO_DIR / 'surplus_offers_demo.csv'
        if surplus_path.exists():
            surplus_records = _load_csv(surplus_path, SurplusOffer)
            for rec in surplus_records:
                if not overwrite:
                    stmt = select(SurplusOffer).where(
                        SurplusOffer.donor == rec.donor,
                        SurplusOffer.food_category == rec.food_category,
                        SurplusOffer.quantity == rec.quantity,
                        SurplusOffer.unit == rec.unit,
                    )
                    if session.exec(stmt).first():
                        continue
                session.add(rec)
        # Recipient needs
        need_path = DEMO_DIR / 'recipient_needs_demo.csv'
        if need_path.exists():
            need_records = _load_csv(need_path, RecipientNeed)
            for rec in need_records:
                if not overwrite:
                    stmt = select(RecipientNeed).where(
                        RecipientNeed.recipient_org == rec.recipient_org,
                        RecipientNeed.food_category == rec.food_category,
                        RecipientNeed.quantity == rec.quantity,
                        RecipientNeed.unit == rec.unit,
                    )
                    if session.exec(stmt).first():
                        continue
                session.add(rec)
        # Waste observations (optional)
        waste_path = DEMO_DIR / 'waste_observations_demo.csv'
        if waste_path.exists():
            waste_records = _load_csv(waste_path, WasteObservation)
            for rec in waste_records:
                if not overwrite:
                    stmt = select(WasteObservation).where(
                        WasteObservation.reporting_source == rec.reporting_source,
                        WasteObservation.food_category == rec.food_category,
                        WasteObservation.quantity == rec.quantity,
                        WasteObservation.unit == rec.unit,
                    )
                    if session.exec(stmt).first():
                        continue
                session.add(rec)
        session.commit()
        print('Demo data loaded')

if __name__ == '__main__':
    load_demo()
