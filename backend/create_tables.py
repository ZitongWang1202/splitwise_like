from app.db.base import Base
from app.db.session import engine

from app.models import *

Base.metadata.create_all(bind=engine)

print("Tables created successfully.")