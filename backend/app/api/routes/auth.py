from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from app.api.dependencies import get_db

from app.schemas.user import (
    UserCreate,
    UserResponse
)

from app.services.auth_service import AuthService


router = APIRouter()


@router.post(
    "/auth/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    created_user = AuthService.register_user(
        db,
        user.email,
        user.password
    )

    if not created_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return created_user


@router.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    token = AuthService.login_user(
        db,
        form_data.username,
        form_data.password
    )

    if not token:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }