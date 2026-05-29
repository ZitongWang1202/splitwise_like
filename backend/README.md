# Splitwise-like Expense Sharing Backend

A production-style backend service for a Splitwise-inspired expense sharing application.

This project was built to practice backend engineering concepts including:

- layered architecture
- authentication and authorization
- financial balance calculation
- debt settlement algorithms
- database migrations
- Docker containerization
- automated testing
- CI pipelines

---

# Tech Stack

## Backend Framework

- FastAPI

## Database

- PostgreSQL
- SQLAlchemy ORM
- Alembic migrations

## Authentication

- JWT authentication
- OAuth2 password flow
- bcrypt password hashing

## Infrastructure

- Docker
- Docker Compose
- GitHub Actions CI

## Testing / Quality

- Pytest
- Ruff

---

# Architecture

The backend follows a layered architecture:

```
Client
↓
API Routes Layer
↓
Service Layer
↓
Repository Layer
↓
Database
```

## Layer Responsibilities

### Routes Layer

Handles:
- HTTP requests
- request validation
- authentication dependencies
- response serialization

### Service Layer

Contains:
- business logic
- balance calculations
- debt settlement algorithm
- transaction orchestration

### Repository Layer

Responsible for:
- database queries
- persistence logic
- data access abstraction

---

# Core Features

## Authentication

- User registration
- JWT login
- Protected routes
- Current user dependency injection

## Group Management

- Create groups
- Add group members

## Expense System

- Create shared expenses
- Track participants
- Split expenses

## Balance Calculation

- Compute net balances per user
- Calculate who owes whom

## Debt Simplification

Implements a settlement algorithm to minimize the number of transactions required to settle group debts.

---

# Database Design

Main entities:

- User
- Group
- GroupMember
- Expense
- ExpenseParticipant

Key design decisions:

- UUID primary keys
- normalized relational structure
- explicit participant tracking
- many-to-many relationship handling

---

# Local Development

## Create virtual environment

```bash
python -m venv venv
```

## Activate environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run server

```bash
uvicorn app.main:app --reload
```

---

# Docker Setup

## Start backend + database

```bash
docker compose up --build
```

## Stop containers

```bash
docker compose down
```

The backend runs inside a Docker container and connects to PostgreSQL through Docker Compose networking.

---

# Database Migrations

## Generate migration

```bash
alembic revision --autogenerate -m "message"
```

## Apply migrations

```bash
alembic upgrade head
```

---

# Testing

## Run tests

```bash
pytest
```

The project uses isolated test configuration and automated API testing.

---

# Linting

## Run Ruff

```bash
ruff check .
```

---

# CI Pipeline

GitHub Actions automatically runs:

- pytest
- Ruff linting
- Docker build verification

on every push and pull request.

---

# Security Design

## Password Handling

Passwords are hashed using bcrypt before storage.

## JWT Authentication

JWT tokens are used for stateless authentication.

## Dependency Injection

Protected routes use dependency injection to validate the current authenticated user.

---

# Future Improvements

Planned future enhancements:

- frontend React application
- Redis caching
- async SQLAlchemy
- background jobs
- email verification
- WebSocket real-time updates
- Kubernetes deployment
- observability / monitoring

---

# Project Goals

This project focuses on learning production-oriented backend engineering practices rather than only implementing CRUD endpoints.