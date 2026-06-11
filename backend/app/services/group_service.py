from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.group_repository import GroupRepository
from app.repositories.user_repository import UserRepository


class GroupService:

    @staticmethod
    def create_group(
        db: Session,
        name: str,
        owner_id: UUID
    ):

        return GroupRepository.create_group(
            db,
            name,
            owner_id
        )

    @staticmethod
    def get_user_groups(
        db: Session,
        user_id: UUID
    ):

        return GroupRepository.get_user_groups(
            db,
            user_id
        )

    @staticmethod
    def get_group_members(
        db: Session,
        group_id: UUID,
        user_id: UUID,
    ):

        return GroupRepository.get_group_members(
            db,
            group_id
        )

    @staticmethod
    def add_group_member(
        db: Session,
        group_id: UUID,
        user_id: UUID,
        email: str,
    ):

        if not GroupRepository.is_group_member(
            db,
            group_id,
            user_id,
        ):
            raise ValueError(
                "Not a member of this group"
            )

        user = UserRepository.get_by_email(
            db,
            email,
        )

        if user is None:
            raise ValueError("User not found")

        if GroupRepository.is_group_member(
            db,
            group_id,
            user.id,
        ):
            raise ValueError("User is already a member")

        GroupRepository.add_group_member(
            db,
            group_id,
            user.id,
        )

        return user