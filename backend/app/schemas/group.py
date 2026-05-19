from pydantic import BaseModel
from uuid import UUID


class GroupCreate(BaseModel):
    name: str

class GroupResponse(BaseModel):

    id: UUID
    name: str
    owner_id: UUID

    class Config:
        from_attributes = True