# Splitwise-like API Documentation

## Authentication

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and get JWT token | No |

---

## Users

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /users/me | Get current user profile | Yes |

---

## Groups

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /groups | List current user's groups | Yes |
| POST | /groups | Create a new group | Yes |
| GET | /groups/{group_id}/members | Get group members | Yes (member only) |
| POST | /groups/{group_id}/members | Add member by email | Yes (member only) |

---

## Expenses

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | /expenses | Create expense | Yes (group member only) |

---

## Balances

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /groups/{group_id}/balances | Get group balances | Yes (group member only) |
| GET | /groups/{group_id}/settlements | Get suggested settlements | Yes (group member only) |

---

## Using JWT Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Obtain a token via `POST /auth/login`. Unauthenticated requests to protected endpoints return **401**. Authenticated requests from non-members return **403** where noted.

---

<!-- ## Response Conventions

- Successful requests return HTTP 200.
- Validation errors return HTTP 422.
- Missing or invalid authentication returns HTTP 401.
- Authorization failures (for example, non-group members accessing protected resources) return HTTP 403.
- Business logic validation failures (for example, duplicate users or invalid expense splits) return HTTP 400.

--- -->

## POST /auth/register

Register a new user account.

**Authentication:** Not required.

### Request

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Success Response (200)

```json
{
  "id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
  "email": "alice@example.com"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 400 | Email already registered |
| 422 | Invalid request body |

---

## POST /auth/login

Login and receive a JWT access token.

**Authentication:** Not required.

### Request

`application/x-www-form-urlencoded` (OAuth2 password flow):

| Field | Value |
|-------|-------|
| username | User email |
| password | User password |

Example:

```
username=alice@example.com&password=password123
```

### Success Response (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Invalid credentials |
| 422 | Invalid request body |

---

## GET /users/me

Get the currently authenticated user's profile.

**Authentication:** Required.

### Success Response (200)

```json
{
  "id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
  "email": "alice@example.com"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |

---

## GET /groups

List all groups the current user belongs to.

**Authentication:** Required.

### Success Response (200)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Roommates",
    "owner_id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c"
  }
]
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |

---

## POST /groups

Create a new group. The creator becomes the owner and is automatically added as a member.

**Authentication:** Required.

### Request

```json
{
  "name": "Roommates"
}
```

### Success Response (200)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Roommates",
  "owner_id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |
| 422 | Invalid request body |

---

## GET /groups/{group_id}/members

List all members of a group.

**Authentication:** Required (group member only).

### Success Response (200)

```json
[
  {
    "id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
    "email": "alice@example.com"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "email": "bob@example.com"
  }
]
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |
| 403 | Not a member of this group |

---

## POST /groups/{group_id}/members

Add an existing user to a group by email.

**Authentication:** Required (group member only).

### Request

```json
{
  "email": "bob@example.com"
}
```

### Success Response (200)

Returns the newly added member:

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "email": "bob@example.com"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 400 | User not found |
| 400 | User is already a member |
| 401 | Missing or invalid token |
| 403 | Not a member of this group |
| 422 | Invalid request body |

---

## POST /expenses

Create an expense in a group. The authenticated user is recorded as the payer (`paid_by_user_id`).

Participant `owed_amount` values must sum exactly to `amount`.

**Authentication:** Required (group member only).

### Request

```json
{
  "group_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Dinner",
  "amount": "100.00",
  "participants": [
    {
      "user_id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
      "owed_amount": "50.00"
    },
    {
      "user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "owed_amount": "50.00"
    }
  ]
}
```

### Success Response (200)

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "group_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "paid_by_user_id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
  "description": "Dinner",
  "amount": "100.00"
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 400 | Participant amounts must equal expense amount |
| 401 | Missing or invalid token |
| 403 | Not a member of this group |
| 422 | Invalid request body |

---

## GET /groups/{group_id}/balances

Get net balances for all members in a group.

Balances are keyed by member email. A **positive** value means the user is owed money (creditor); a **negative** value means the user owes money (debtor).

**Authentication:** Required (group member only).

### Success Response (200)

```json
{
  "alice@example.com": 50,
  "bob@example.com": -50
}
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |
| 403 | Not a member of this group |

---

## GET /groups/{group_id}/settlements

Get a simplified list of suggested payments to settle all group debts.

Each settlement indicates that `from_email` should pay `to_email` the given `amount`.

**Authentication:** Required (group member only).

### Success Response (200)

```json
[
  {
    "from_user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "to_user_id": "9a6d4f9b-44f5-4e1d-a93b-9c1df85a7d1c",
    "amount": 50,
    "from_email": "bob@example.com",
    "to_email": "alice@example.com"
  }
]
```

### Possible Errors

| Status | Description |
|----------|-------------|
| 401 | Missing or invalid token |
| 403 | Not a member of this group |
