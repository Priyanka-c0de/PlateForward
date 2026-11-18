from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_auth_login_admin():
    response = client.post("/auth/login", json={
        "email": "admin@urbanfoodwaste.org",
        "password": "Admin@12345"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "Administrator"
    assert "hashed_password" not in data["user"]

def test_admin_overview_protected():
    # Login admin
    login_resp = client.post("/auth/login", json={
        "email": "admin@urbanfoodwaste.org",
        "password": "Admin@12345"
    })
    token = login_resp.json()["access_token"]
    
    # Overview request with token
    resp = client.get("/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_users"] >= 3
    assert data["total_surplus_offers"] >= 1
    assert data["total_recipient_needs"] >= 1

def test_admin_overview_forbidden_without_auth():
    resp = client.get("/admin/overview")
    assert resp.status_code in (401, 403)

def test_location_nearby_discovery():
    # Test Delhi coordinates
    resp = client.get("/location/nearby-surplus?lat=28.6304&lng=77.2177&radius_km=30")
    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    if items:
        assert items[0]["distance_km"] <= 30.0

def test_location_all_markers():
    resp = client.get("/location/all-markers?user_lat=28.6304&user_lng=77.2177")
    assert resp.status_code == 200
    markers = resp.json()
    assert isinstance(markers, list)
    assert len(markers) >= 2
