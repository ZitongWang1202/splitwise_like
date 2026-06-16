from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user
)

from app.models.user import User

from app.repositories.user_repository import UserRepository

from app.core.exceptions import ForbiddenError
from app.services.balance_service import (
    BalanceService
)

from app.services.group_service import GroupService

router = APIRouter()


def _user_label(db: Session, user_id: UUID) -> str:
    user = UserRepository.get_by_id(db, user_id)
    return user.email if user else str(user_id)


@router.get("/groups/{group_id}/balances")
def get_group_balances(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        GroupService.require_group_member(
            db,
            group_id,
            current_user.id,
        )
    except ForbiddenError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    balances = BalanceService.calculate_group_balances(
        db,
        group_id
    )
    return {
        _user_label(db, user_id): balance
        for user_id, balance in balances.items()
    }

@router.get(
    "/groups/{group_id}/settlements"
)
def get_group_settlements(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        GroupService.require_group_member(
            db,
            group_id,
            current_user.id,
        )
    except ForbiddenError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

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

    return [
        {
            **settlement,
            "from_email": _user_label(
                db,
                settlement["from_user_id"],
            ),
            "to_email": _user_label(
                db,
                settlement["to_user_id"],
            ),
        }
        for settlement in settlements
    ]