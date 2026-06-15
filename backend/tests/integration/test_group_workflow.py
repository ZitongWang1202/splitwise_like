from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_group_workflow():

    # Register
    client.post(
        "/auth/register",
        json={
            "email": "workflow@example.com",
            "password": "password123",
        },
    )

    # Login
    login_response = client.post(
        "/auth/login",
        data={
            "username": "workflow@example.com",
            "password": "password123",
        },
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create group
    create_response = client.post(
        "/groups",
        json={
            "name": "Integration Test Group",
        },
        headers=headers,
    )

    assert create_response.status_code == 200

    group_id = create_response.json()["id"]

    # Verify group appears in list
    groups_response = client.get(
        "/groups",
        headers=headers,
    )

    assert groups_response.status_code == 200

    groups = groups_response.json()

    assert any(
        group["id"] == group_id
        for group in groups
    )