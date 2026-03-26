from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user
from app.routers import auth
from app.routers import watchlist
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
app = FastAPI(title="Crypto Watchlist API")
Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "API is running 🚀"}
app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(watchlist.router, prefix="/api/v1/watchlist")
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return {
        "error": "Internal Server Error",
        "message": str(exc)
    }