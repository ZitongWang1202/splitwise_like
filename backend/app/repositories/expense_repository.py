from uuid import UUID

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.expense_participant import (
    ExpenseParticipant
)


class ExpenseRepository:

    @staticmethod
    def create_expense(
        db: Session,
        group_id: UUID,
        paid_by_user_id: UUID,
        description: str,
        amount,
        participants: list
    ):

        expense = Expense(
            group_id=group_id,
            paid_by_user_id=paid_by_user_id,
            description=description,
            amount=amount
        )

        db.add(expense)

        db.flush()

        for participant in participants:

            expense_participant = ExpenseParticipant(
                expense_id=expense.id,
                user_id=participant.user_id,
                owed_amount=participant.owed_amount
            )

            db.add(expense_participant)

        db.commit()

        db.refresh(expense)

        return expense