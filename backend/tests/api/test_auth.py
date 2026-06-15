from tests.conftest import client


def test_register_user():

    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )

    # print(response.status_code)
    # print(response.json())

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == (
        "test@example.com"
    )

def test_duplicate_registration():

    client.post(
        "/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 400

def test_login():

    client.post(
        "/auth/register",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "login@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data

def test_get_current_user():

    client.post(
        "/auth/register",
        json={
            "email": "me@example.com",
            "password": "password123"
        }
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "me@example.com",
            "password": "password123"
        }
    )

    token = (
        login_response.json()["access_token"]
    )

    response = client.get(
        "/users/me",
        headers={
            "Authorization": (
                f"Bearer {token}"
            )
        }
    )

    assert response.status_code == 200