from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError
from app.repositories.group_repository import GroupRepository
from app.repositories.expense_repository import (
    ExpenseRepository
)


class ExpenseService:

    @staticmethod
    def create_expense(
        db: Session,
        group_id: UUID,
        paid_by_user_id: UUID,
        description: str,
        amount: Decimal,
        participants: list
    ):

        total_owed = sum(
            p.owed_amount for p in participants
        )

        if total_owed != amount:

            raise ValueError(
                "Participant amounts must equal expense amount"
            )

        if not GroupRepository.is_group_member(
            db,
            group_id,
            paid_by_user_id,
        ):
            raise ForbiddenError(
                "Not a member of this group"
            )

        return ExpenseRepository.create_expense(
            db,
            group_id,
            paid_by_user_id,
            description,
            amount,
            participants
        )