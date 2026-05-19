from sqlalchemy import (
    Column,
    ForeignKey,
    Numeric
)

from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class ExpenseParticipant(Base):

    __tablename__ = "expense_participants"

    expense_id = Column(
        UUID(as_uuid=True),
        ForeignKey("expenses.id"),
        primary_key=True
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True
    )

    owed_amount = Column(
        Numeric(10, 2),
        nullable=False
    )