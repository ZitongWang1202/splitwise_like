from uuid import UUID

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.expense_participant import (
    ExpenseParticipant
)


class BalanceRepository:

    @staticmethod
    def get_group_expenses(
        db: Session,
        group_id: UUID
    ):

        return (
            db.query(Expense)
            .filter(Expense.group_id == group_id)
            .all()
        )

    @staticmethod
    def get_group_participants(
        db: Session,
        group_id: UUID
    ):

        return (
            db.query(
                ExpenseParticipant,
                Expense
            )
            .join(
                Expense,
                Expense.id == ExpenseParticipant.expense_id
            )
            .filter(
                Expense.group_id == group_id
            )
            .all()
        )