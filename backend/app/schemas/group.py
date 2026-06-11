from pydantic import BaseModel
from uuid import UUID
from pydantic import EmailStr


class GroupCreate(BaseModel):
    name: str

class GroupResponse(BaseModel):

    id: UUID
    name: str
    owner_id: UUID

    class Config:
        from_attributes = True

class AddGroupMemberRequest(BaseModel):
    email: EmailStr