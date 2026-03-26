from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def clean_password(p: str):
    return str(p).strip()[:72]   # 🔥 normalize EVERYTHING


def hash_password(password: str):
    return pwd_context.hash(clean_password(password))


def verify_password(plain, hashed):
    return pwd_context.verify(clean_password(plain), hashed)
