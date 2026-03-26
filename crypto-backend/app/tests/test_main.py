from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)


def test_register():
    email = f"test_{uuid.uuid4()}@example.com"

    response = client.post("/auth/register", json={
        "email": email,
        "password": "123456"
    })

    assert response.status_code == 200


def test_login():
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "123456"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_protected_route_fail():
    response = client.get("/watchlist/")
    
    assert response.status_code in [401, 403]


def test_protected_route_success():
    login = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "123456"
    })

    token = login.json()["access_token"]

    response = client.get(
        "/watchlist/",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200