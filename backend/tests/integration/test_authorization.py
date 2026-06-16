"""
Authorization integration tests (MVP):

Unauthenticated requests should return 401:
- GET /groups
- POST /groups
- GET /users/me
- POST /expenses
- GET /groups/{id}/members
- POST /groups/{id}/members
- GET /groups/{id}/balances
- GET /groups/{id}/settlements

Non-member access should return 403:
- Invite members
- View members
- View balances
- View settlements
- Create expense in group
"""

from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _register(email: str) -> None:
    client.post(
        "/auth/register",
        json={
            "email": email,
            "password": "password123",
        },
    )


def _login(email: str) -> dict:
    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": "password123",
        },
    )

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def _setup_group_with_outsider():
    _register("auth_owner@example.com")
    _register("auth_outsider@example.com")

    owner_headers = _login("auth_owner@example.com")
    outsider_headers = _login("auth_outsider@example.com")

    create_group_response = client.post(
        "/groups",
        json={
            "name": "Authorization Test Group",
        },
        headers=owner_headers,
    )

    group_id = create_group_response.json()["id"]

    members_response = client.get(
        f"/groups/{group_id}/members",
        headers=owner_headers,
    )

    owner_id = members_response.json()[0]["id"]

    return group_id, owner_headers, outsider_headers, owner_id


def test_unauthenticated_requests_return_401():
    group_id = uuid4()

    unauthenticated_requests = [
        ("get", "/groups", {}),
        ("post", "/groups", {"json": {"name": "No Auth Group"}}),
        ("get", "/users/me", {}),
        (
            "post",
            "/expenses",
            {
                "json": {
                    "group_id": str(group_id),
                    "description": "Dinner",
                    "amount": "10.00",
                    "participants": [],
                }
            },
        ),
        ("get", f"/groups/{group_id}/members", {}),
        (
            "post",
            f"/groups/{group_id}/members",
            {"json": {"email": "someone@example.com"}},
        ),
        ("get", f"/groups/{group_id}/balances", {}),
        ("get", f"/groups/{group_id}/settlements", {}),
    ]

    for method, path, kwargs in unauthenticated_requests:
        response = getattr(client, method)(path, **kwargs)
        assert response.status_code == 401


def test_non_member_cannot_invite_members():
    group_id, _, outsider_headers, _ = _setup_group_with_outsider()

    response = client.post(
        f"/groups/{group_id}/members",
        json={
            "email": "newmember@example.com",
        },
        headers=outsider_headers,
    )

    assert response.status_code == 403


def test_non_member_cannot_view_members():
    group_id, _, outsider_headers, _ = _setup_group_with_outsider()

    response = client.get(
        f"/groups/{group_id}/members",
        headers=outsider_headers,
    )

    assert response.status_code == 403


def test_non_member_cannot_view_balances():
    group_id, _, outsider_headers, _ = _setup_group_with_outsider()

    response = client.get(
        f"/groups/{group_id}/balances",
        headers=outsider_headers,
    )

    assert response.status_code == 403


def test_non_member_cannot_view_settlements():
    group_id, _, outsider_headers, _ = _setup_group_with_outsider()

    response = client.get(
        f"/groups/{group_id}/settlements",
        headers=outsider_headers,
    )

    assert response.status_code == 403


def test_non_member_cannot_create_expense():
    group_id, _, outsider_headers, owner_id = (
        _setup_group_with_outsider()
    )

    response = client.post(
        "/expenses",
        json={
            "group_id": group_id,
            "description": "Unauthorized expense",
            "amount": "20.00",
            "participants": [
                {
                    "user_id": owner_id,
                    "owed_amount": "20.00",
                },
            ],
        },
        headers=outsider_headers,
    )

    assert response.status_code == 403
