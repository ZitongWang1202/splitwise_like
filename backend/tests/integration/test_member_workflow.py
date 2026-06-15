from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_member_workflow():

    # Register owner
    client.post(
        "/auth/register",
        json={
            "email": "owner@example.com",
            "password": "password123",
        },
    )

    # Register invited user
    client.post(
        "/auth/register",
        json={
            "email": "member@example.com",
            "password": "password123",
        },
    )

    # Login owner
    login_response = client.post(
        "/auth/login",
        data={
            "username": "owner@example.com",
            "password": "password123",
        },
    )

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create group
    create_group_response = client.post(
        "/groups",
        json={
            "name": "Integration Group",
        },
        headers=headers,
    )

    group_id = create_group_response.json()["id"]

    # Invite member
    invite_response = client.post(
        f"/groups/{group_id}/members",
        json={
            "email": "member@example.com",
        },
        headers=headers,
    )

    assert invite_response.status_code == 200

    # Query member list
    members_response = client.get(
        f"/groups/{group_id}/members",
        headers=headers,
    )

    assert members_response.status_code == 200

    members = members_response.json()

    emails = {
        member["email"]
        for member in members
    }

    assert "owner@example.com" in emails
    assert "member@example.com" in emails