from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.watchlist import Watchlist
from app.services.crypto_service import get_coin_price
from app.utils.deps import get_current_user
from app.utils.role import require_admin
from app.schemas.watchlist import AddCoinRequest
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/add")
def add_coin(
    data: AddCoinRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    logger.info(f"User {user['user_id']} adding coin {data.coin}")

    price = get_coin_price(data.coin)

    if price is None:
        logger.error("Failed to fetch price")
        raise HTTPException(status_code=500, detail="Failed to fetch price")

    entry = Watchlist(
        user_id=user["user_id"],
        coin=data.coin,   # ✅ FIXED
        price=price
    )

    db.add(entry)        # ✅ IMPORTANT
    db.commit()          # ✅ IMPORTANT
    db.refresh(entry)

    return {"msg": "Coin added", "price": price}


@router.get("/")
def get_watchlist(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Watchlist).filter(
        Watchlist.user_id == user["user_id"]
    ).all()


@router.delete("/{id}")
def delete_coin(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    coin = db.query(Watchlist).filter(Watchlist.id == id).first()

    if not coin:
        raise HTTPException(status_code=404, detail="Not found")

    if coin.user_id != user["user_id"]:
        logger.warning(f"Unauthorized delete by user {user['user_id']}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    db.delete(coin)
    db.commit()

    return {"msg": "Deleted"}


@router.delete("/admin/{id}")
def admin_delete(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_admin(user)

    coin = db.query(Watchlist).filter(Watchlist.id == id).first()

    if not coin:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(coin)
    db.commit()

    return {"msg": "Admin deleted"}
