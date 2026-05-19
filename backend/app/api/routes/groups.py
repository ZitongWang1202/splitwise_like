from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user
)

from app.models.user import User

from app.schemas.group import (
    GroupCreate,
    GroupResponse
)

from app.services.group_service import GroupService


router = APIRouter()


@router.post(
    "/groups",
    response_model=GroupResponse
)
def create_group(
    data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return GroupService.create_group(
        db,
        data.name,
        current_user.id
    )


@router.get(
    "/groups",
    response_model=list[GroupResponse]
)
def get_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return GroupService.get_user_groups(
        db,
        current_user.id
    )