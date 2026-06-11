from uuid import UUID

from sqlalchemy.orm import Session

from app.models.group import Group
from app.models.group_member import GroupMember
from app.models.user import User


class GroupRepository:

    @staticmethod
    def create_group(
        db: Session,
        name: str,
        owner_id: UUID
    ):

        group = Group(
            name=name,
            owner_id=owner_id
        )

        db.add(group)

        db.flush()

        membership = GroupMember(
            group_id=group.id,
            user_id=owner_id,
            role="owner"
        )

        db.add(membership)

        db.commit()

        db.refresh(group)

        return group

    @staticmethod
    def get_user_groups(
        db: Session,
        user_id: UUID
    ):

        return (
            db.query(Group)
            .join(GroupMember)
            .filter(GroupMember.user_id == user_id)
            .all()
        )

    @staticmethod
    def is_group_member(
        db: Session,
        group_id: UUID,
        user_id: UUID,
    ) -> bool:

        return (
            db.query(GroupMember)
            .filter(
                GroupMember.group_id == group_id,
                GroupMember.user_id == user_id,
            )
            .first()
            is not None
        )

    @staticmethod
    def get_group_members(
        db: Session,
        group_id: UUID
    ):

        return (
            db.query(User)
            .join(
                GroupMember,
                GroupMember.user_id == User.id,
            )
            .filter(GroupMember.group_id == group_id)
            .all()
        )


    @staticmethod
    def add_group_member(
        db: Session,
        group_id: UUID,
        user_id: UUID,
    ):
        group_member = GroupMember(
            group_id=group_id,
            user_id=user_id,
        )

        db.add(group_member)
        db.commit()
        db.refresh(group_member)

        return group_member
