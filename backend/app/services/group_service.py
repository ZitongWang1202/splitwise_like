from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.group_repository import GroupRepository


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