from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user
)

from app.models.user import User

from app.schemas.group import (
    GroupCreate,
    GroupResponse,
    AddGroupMemberRequest
)

from app.schemas.user import UserResponse

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


@router.get(
    "/groups/{group_id}/members",
    response_model=list[UserResponse],
)
def get_group_members(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return GroupService.get_group_members(
        db,
        group_id,
        current_user.id,
    )

@router.post(
    "/groups/{group_id}/members",
    response_model=UserResponse,
)
def add_group_member(
    group_id: UUID,
    request: AddGroupMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        return GroupService.add_group_member(
            db,
            group_id,
            current_user.id,
            request.email,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )