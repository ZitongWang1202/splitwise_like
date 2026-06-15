import os

from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

from fastapi.testclient import TestClient

from app.main import app

from app.db.base import Base
from app.api.dependencies import get_db


SQLALCHEMY_DATABASE_URL = (
    "sqlite:///./test.db"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


if os.path.exists("test.db"):
    os.remove("test.db")

Base.metadata.create_all(bind=engine)

# @pytest.fixture(autouse=True)
# def reset_database():
#     yield

def override_get_db():

    db = TestingSessionLocal()

    try:
        yield db

    finally:
        db.close()


app.dependency_overrides[get_db] = (
    override_get_db
)

client = TestClient(app)