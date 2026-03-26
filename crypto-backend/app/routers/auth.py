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
    try:
        existing_user = db.query(User).filter(User.email == data.email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        user = User(
            email=data.email,
            password=hash_password(data.password),
            role="user"
        )
        print("RAW PASSWORD:", repr(data.password))
        print("TYPE:", type(data.password))
        print("LEN:", len(str(data.password)))
        db.add(user)
        db.commit()
        db.refresh(user)

        return {"msg": "User created"}

    except Exception as e:
        print("REGISTER ERROR:", str(e))  # 🔥 THIS WILL SHOW REAL ERROR IN RENDER LOGS
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_token({
            "user_id": user.id,
            "role": user.role
        })

        return {"access_token": token}

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))