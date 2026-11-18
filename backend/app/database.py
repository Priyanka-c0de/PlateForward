import os
import sqlite3
from datetime import datetime
from sqlmodel import SQLModel, create_engine, Session, select

# SQLite database path (within backend folder)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./food_waste.db")

engine = create_engine(DATABASE_URL, echo=False)

def migrate_sqlite_columns():
    """Safely adds missing columns to existing SQLite tables without losing data."""
    try:
        db_path = DATABASE_URL.replace("sqlite:///", "")
        if not os.path.exists(db_path):
            return
        con = sqlite3.connect(db_path)
        cur = con.cursor()

        # Helper to check and add column
        def ensure_column(table_name: str, col_name: str, col_type: str):
            cur.execute(f"PRAGMA table_info({table_name})")
            cols = [info[1] for info in cur.fetchall()]
            if col_name not in cols:
                cur.execute(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}")

        # Check existing tables
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in cur.fetchall()]

        if "surplusoffer" in tables:
            ensure_column("surplusoffer", "latitude", "FLOAT")
            ensure_column("surplusoffer", "longitude", "FLOAT")
            ensure_column("surplusoffer", "user_id", "INTEGER")

        if "recipientneed" in tables:
            ensure_column("recipientneed", "latitude", "FLOAT")
            ensure_column("recipientneed", "longitude", "FLOAT")
            ensure_column("recipientneed", "user_id", "INTEGER")

        if "wasteobservation" in tables:
            ensure_column("wasteobservation", "latitude", "FLOAT")
            ensure_column("wasteobservation", "longitude", "FLOAT")

        con.commit()
        con.close()
    except Exception as e:
        print(f"Migration note: {e}")

def seed_initial_data():
    """Seeds default accounts and real-world urban coordinates for demonstration."""
    from .models import User, SurplusOffer, RecipientNeed
    from .auth import hash_password

    with Session(engine) as session:
        # 1. Seed Administrator if no admin exists
        admin = session.exec(select(User).where(User.email == "admin@urbanfoodwaste.org")).first()
        if not admin:
            admin_user = User(
                full_name="System Administrator",
                email="admin@urbanfoodwaste.org",
                hashed_password=hash_password("Admin@12345"),
                phone_number="+91 98765 43210",
                organization_name="Urban Food Waste Intelligence",
                role="Administrator",
                location="Delhi NCR, India",
                latitude=28.6139,
                longitude=77.2090,
                is_active=True,
            )
            session.add(admin_user)

        # 2. Seed Demo Food Donor
        donor = session.exec(select(User).where(User.email == "donor@metrofoods.org")).first()
        if not donor:
            donor_user = User(
                full_name="Metro Fresh Supermarket",
                email="donor@metrofoods.org",
                hashed_password=hash_password("Donor@12345"),
                phone_number="+91 98111 22334",
                organization_name="Metro Retail Chain",
                role="Food Donor",
                location="Connaught Place, New Delhi",
                latitude=28.6304,
                longitude=77.2177,
                is_active=True,
            )
            session.add(donor_user)

        # 3. Seed Demo Food Recipient (NGO)
        recipient = session.exec(select(User).where(User.email == "ngo@hopefoundation.org")).first()
        if not recipient:
            recipient_user = User(
                full_name="Hope Community Kitchen",
                email="ngo@hopefoundation.org",
                hashed_password=hash_password("Ngo@12345"),
                phone_number="+91 98222 33445",
                organization_name="Hope Relief Foundation",
                role="Food Recipient",
                location="Sector 62, Noida",
                latitude=28.6280,
                longitude=77.3649,
                is_active=True,
            )
            session.add(recipient_user)

        session.commit()

        # 4. Populate coordinates for existing surplus offers if missing
        surpluses = session.exec(select(SurplusOffer)).all()
        # Realistic urban coordinates around Delhi NCR (distance ~ 3 - 15 km)
        surplus_coords = [
            (28.6304, 77.2177, "Connaught Place, Central Delhi"),
            (28.5355, 77.3910, "Sector 18, Noida"),
            (28.4595, 77.0266, "Cyber City, Gurugram"),
            (28.6129, 77.2295, "India Gate Area, New Delhi"),
            (28.7041, 77.1025, "Rohini Hub, North Delhi"),
            (28.5244, 77.1855, "Saket District Centre, South Delhi"),
            (28.6507, 77.3153, "Anand Vihar, East Delhi"),
        ]
        for idx, s in enumerate(surpluses):
            if s.latitude is None or s.longitude is None:
                coord = surplus_coords[idx % len(surplus_coords)]
                s.latitude = coord[0]
                s.longitude = coord[1]
                if "Test Location" in s.pickup_location or "Demo Location" in s.pickup_location:
                    s.pickup_location = coord[2]
                session.add(s)

        # 5. Populate coordinates for existing recipient needs if missing
        needs = session.exec(select(RecipientNeed)).all()
        need_coords = [
            (28.6280, 77.3649, "Sector 62 Shelter, Noida"),
            (28.6189, 77.2155, "Paharganj Community Kitchen, Delhi"),
            (28.4744, 77.0425, "Gurugram Care Center"),
            (28.5700, 77.3200, "Mayur Vihar Food Bank"),
        ]
        for idx, n in enumerate(needs):
            if n.latitude is None or n.longitude is None:
                coord = need_coords[idx % len(need_coords)]
                n.latitude = coord[0]
                n.longitude = coord[1]
                if "Demo Location" in n.delivery_location:
                    n.delivery_location = coord[2]
                session.add(n)

        session.commit()

def init_db():
    """Create database tables and run migration/seeding."""
    from .models import User, SurplusOffer, RecipientNeed, WasteObservation, Match
    migrate_sqlite_columns()
    SQLModel.metadata.create_all(engine)
    seed_initial_data()
