from uuid import UUID

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user
)

from app.models.user import User

from app.services.balance_service import (
    BalanceService
)

router = APIRouter()

@router.get("/groups/{group_id}/balances")
def get_group_balances(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    balances = BalanceService.calculate_group_balances(
        db,
        group_id
    )
    return balances

@router.get(
    "/groups/{group_id}/settlements"
)
def get_group_settlements(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    balances = (
        BalanceService.calculate_group_balances(
            db,
            group_id
        )
    )

    settlements = (
        BalanceService.simplify_debts(
            balances
        )
    )

    return settlements