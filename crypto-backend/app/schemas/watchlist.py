from pydantic import BaseModel

class AddCoinRequest(BaseModel):
    coin: str