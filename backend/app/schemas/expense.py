from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID


class ExpenseParticipantInput(BaseModel):

    user_id: UUID
    owed_amount: Decimal

class ExpenseCreate(BaseModel):

    group_id: UUID
    description: str
    amount: Decimal

    participants: list[ExpenseParticipantInput]

class ExpenseResponse(BaseModel):

    id: UUID
    group_id: UUID
    paid_by_user_id: UUID
    description: str
    amount: Decimal

    class Config:
        from_attributes = True