from fastapi import FastAPI
from .database import engine, init_db
from .routers import surplus, need, waste, match, analytics, data_import, auth, admin, location
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Urban Food Waste Intelligence API",
    description="Enterprise API for food waste analytics, donor-recipient smart matching, user authentication, and nearby geospatial discovery."
)

# CORS configuration – allow Vite dev server and local clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/admin", tags=["Database Management & Admin"])
app.include_router(location.router, prefix="/location", tags=["Nearby Geolocation & Maps"])
app.include_router(surplus.router, prefix="/surplus", tags=["Surplus Offer"])
app.include_router(need.router, prefix="/need", tags=["Recipient Need"])
app.include_router(waste.router, prefix="/waste", tags=["Waste Observation"])
app.include_router(match.router, prefix="/match", tags=["Match Engine"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(data_import.router, prefix="/import", tags=["Data Import"])

# Create tables on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Urban Food Waste Intelligence API is running",
        "version": "2.0.0",
        "status": "online"
    }
