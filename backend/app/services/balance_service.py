from decimal import Decimal
from collections import defaultdict
from uuid import UUID

from app.repositories.balance_repository import (
    BalanceRepository
)


class BalanceService:

    @staticmethod
    def calculate_group_balances(
        db,
        group_id: UUID
    ):

        balances = defaultdict(Decimal)

        expenses = (
            BalanceRepository.get_group_expenses(
                db,
                group_id
            )
        )

        participants = (
            BalanceRepository.get_group_participants(
                db,
                group_id
            )
        )

        # Add money paid
        for expense in expenses:

            balances[
                expense.paid_by_user_id
            ] += expense.amount

        # Subtract money owed
        for (
            participant,
            expense
        ) in participants:

            balances[
                participant.user_id
            ] -= participant.owed_amount

        return balances

    @staticmethod
    def simplify_debts(
        balances
    ):

        creditors = []
        debtors = []

        # Separate creditors/debtors
        for (
            user_id,
            balance
        ) in balances.items():

            if balance > 0:

                creditors.append([
                    user_id,
                    balance
                ])

            elif balance < 0:

                debtors.append([
                    user_id,
                    abs(balance)
                ])

        settlements = []

        i = 0
        j = 0

        while (
            i < len(debtors)
            and j < len(creditors)
        ):

            debtor_id, debt_amount = debtors[i]

            creditor_id, credit_amount = creditors[j]

            settlement_amount = min(
                debt_amount,
                credit_amount
            )

            settlements.append({
                "from_user_id": debtor_id,
                "to_user_id": creditor_id,
                "amount": settlement_amount
            })

            debtors[i][1] -= settlement_amount
            creditors[j][1] -= settlement_amount

            if debtors[i][1] == 0:
                i += 1

            if creditors[j][1] == 0:
                j += 1

        return settlements