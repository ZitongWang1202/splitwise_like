from uuid import UUID

from sqlalchemy.orm import Session

from app.models.group import Group
from app.models.group_member import GroupMember


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