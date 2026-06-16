from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_expense_settlement_workflow():

    # Register A
    client.post(
        "/auth/register",
        json={
            "email": "user_a@example.com",
            "password": "password123",
        },
    )

    # Register B
    client.post(
        "/auth/register",
        json={
            "email": "user_b@example.com",
            "password": "password123",
        },
    )

    # Login as A
    login_response = client.post(
        "/auth/login",
        data={
            "username": "user_a@example.com",
            "password": "password123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create group
    create_group_response = client.post(
        "/groups",
        json={
            "name": "Expense Settlement Group",
        },
        headers=headers,
    )

    assert create_group_response.status_code == 200

    group_id = create_group_response.json()["id"]

    # Add B
    add_member_response = client.post(
        f"/groups/{group_id}/members",
        json={
            "email": "user_b@example.com",
        },
        headers=headers,
    )

    assert add_member_response.status_code == 200

    # Get user IDs for expense participants
    me_response = client.get(
        "/users/me",
        headers=headers,
    )

    assert me_response.status_code == 200

    user_a_id = me_response.json()["id"]

    members_response = client.get(
        f"/groups/{group_id}/members",
        headers=headers,
    )

    assert members_response.status_code == 200

    members = members_response.json()

    user_b_id = next(
        member["id"]
        for member in members
        if member["email"] == "user_b@example.com"
    )

    # Create expense split between A and B
    expense_response = client.post(
        "/expenses",
        json={
            "group_id": group_id,
            "description": "Dinner",
            "amount": "100.00",
            "participants": [
                {
                    "user_id": user_a_id,
                    "owed_amount": "50.00",
                },
                {
                    "user_id": user_b_id,
                    "owed_amount": "50.00",
                },
            ],
        },
        headers=headers,
    )

    assert expense_response.status_code == 200

    # Request balances
    balances_response = client.get(
        f"/groups/{group_id}/balances",
        headers=headers,
    )

    assert balances_response.status_code == 200

    balances = balances_response.json()

    # Verify the balances are correct
    assert balances["user_a@example.com"] == 50
    assert balances["user_b@example.com"] == -50

    # GET /groups/{id}/settlements
    settlements_response = client.get(
        f"/groups/{group_id}/settlements",
        headers=headers,
    )

    assert settlements_response.status_code == 200

    settlements = settlements_response.json()

    # Verify settlement list is generated
    assert len(settlements) == 1
    assert settlements[0]["from_email"] == "user_b@example.com"
    assert settlements[0]["to_email"] == "user_a@example.com"
    assert settlements[0]["amount"] == 50
