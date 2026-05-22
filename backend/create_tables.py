from app.db.base import Base
from app.db.session import engine

from app.models.user import User
from app.models.group import Group
from app.models.group_member import GroupMember
from app.models.expense import Expense
from app.models.expense_participant import (
    ExpenseParticipant
)

Base.metadata.create_all(bind=engine)

print("Tables created successfully.")