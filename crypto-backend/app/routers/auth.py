from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_token
from app.schemas.auth import RegisterRequest, LoginRequest
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        email=data.email,
        password=hash_password(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"msg": "User created"}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({
        "user_id": user.id,
        "role": user.role
    })

    return {"access_token": token}