from sqlalchemy import (
    Column,
    ForeignKey,
    String
)

from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class GroupMember(Base):

    __tablename__ = "group_members"

    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id"),
        primary_key=True
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True
    )

    role = Column(
        String,
        default="member"
    )