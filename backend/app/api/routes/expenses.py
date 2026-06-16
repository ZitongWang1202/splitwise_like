from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user
)

from app.models.user import User

from app.core.exceptions import ForbiddenError
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse
)

from app.services.expense_service import (
    ExpenseService
)


router = APIRouter()


@router.post(
    "/expenses",
    response_model=ExpenseResponse
)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return ExpenseService.create_expense(
            db,
            data.group_id,
            current_user.id,
            data.description,
            data.amount,
            data.participants
        )

    except ForbiddenError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )