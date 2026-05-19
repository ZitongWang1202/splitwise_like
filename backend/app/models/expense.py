from sqlalchemy import (
    Column,
    String,
    ForeignKey,
    Numeric
)

from sqlalchemy.dialects.postgresql import UUID

import uuid

from app.db.base import Base


class Expense(Base):

    __tablename__ = "expenses"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    group_id = Column(
        UUID(as_uuid=True),
        ForeignKey("groups.id"),
        nullable=False
    )

    paid_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    amount = Column(
        Numeric(10, 2),
        nullable=False
    )