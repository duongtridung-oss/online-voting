from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from redis_client import get_redis
from database import init_db
from routers import auth, admin, polls, candidates

app = FastAPI(
    title="VoteCast API",
    description="Backend API cho Hệ thống Bỏ phiếu Trực tuyến VoteCast",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(polls.router)
app.include_router(candidates.router)



@app.on_event("startup")
async def start_db():
    await init_db()
    
    # Tạo tài khoản admin mặc định nếu chưa có
    from models import User
    from auth import get_password_hash
    
    admin_user = await User.find_one(User.email == "admin@gmail.com")
    if not admin_user:
        hashed_password = get_password_hash("123456")
        new_admin = User(
            username="admin",
            email="admin@gmail.com",
            hashed_password=hashed_password,
            role="admin",
            is_active=True,
            full_name="System Administrator",
            is_profile_complete=True
        )
        await new_admin.insert()
        print("Đã tạo tài khoản admin mặc định: admin@gmail.com / 123456")

@app.get("/")
async def root():
    return {"message": "VoteCast API đang hoạt động!"}
