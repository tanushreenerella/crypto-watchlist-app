from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    coin = Column(String)
    price = Column(Float)