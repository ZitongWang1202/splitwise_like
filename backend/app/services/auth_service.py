from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        email: str,
        password: str
    ):

        existing_user = UserRepository.get_by_email(
            db,
            email
        )

        if existing_user:
            return None

        hashed_password = hash_password(password)

        return UserRepository.create(
            db,
            email,
            hashed_password
        )

    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str
    ):

        user = UserRepository.get_by_email(
            db,
            email
        )

        if not user:
            return None

        if not verify_password(
            password,
            user.password_hash
        ):
            return None

        token = create_access_token(
            data={
                "sub": str(user.id)
            }
        )

        return token