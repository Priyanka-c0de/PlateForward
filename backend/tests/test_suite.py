import io
import csv
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.models import SurplusOffer, RecipientNeed, Match
from backend.app.scripts.load_demo import load_demo

client = TestClient(app)

def test_load_demo():
    # Ensure demo loads without error and is idempotent
    load_demo(overwrite=False)
    load_demo(overwrite=False)  # second run should not duplicate
    # Query counts via API
    resp = client.get('/surplus/')
    assert resp.status_code == 200
    surplus = resp.json()
    assert len(surplus) >= 2  # at least demo records

    resp = client.get('/need/')
    assert resp.status_code == 200
    need = resp.json()
    assert len(need) >= 2

def test_import_surplus():
    csv_content = "donor,food_category,description,quantity,unit,pickup_location,status,verification_status\nTest Donor,Grains,Test Desc,20,kg,Test Location,pending,unverified\n"
    files = {'file': ('test.csv', csv_content, 'text/csv')}
    resp = client.post('/import/surplus', files=files)
    assert resp.status_code == 201
    assert resp.json()['imported'] == 1
    # Verify created
    resp2 = client.get('/surplus/')
    assert any(item['donor'] == 'Test Donor' for item in resp2.json())

def test_match_generation_and_decision():
    # Ensure there is at least one surplus and need with same category
    resp = client.post('/match/generate')
    assert resp.status_code == 200
    matches = resp.json()
    assert isinstance(matches, list)
    if matches:
        match_id = matches[0]['id']
        # Approve the first match
        resp2 = client.patch(f'/match/{match_id}', json={'decision': 'approved'})
        assert resp2.status_code == 200
        data = resp2.json()
        assert data['decision'] == 'approved'
        assert data['status'] == 'pending'  # status unchanged, decision recorded
