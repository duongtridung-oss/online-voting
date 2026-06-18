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

async def process_vote_queue():
    redis = await get_redis()
    print("Bắt đầu worker xử lý hàng đợi vote từ Redis...")
    while True:
        try:
            result = await redis.brpop("vote_queue", timeout=5)
            if result:
                _, vote_data_str = result
                vote_data = json.loads(vote_data_str)
                
                poll_id = vote_data["poll_id"]
                user_id = vote_data["user_id"]
                option_id = vote_data["option_id"]
                
                from models import Vote, Poll
                
                existing_vote = await Vote.find_one(Vote.user_id == user_id, Vote.poll_id == poll_id)
                if not existing_vote:
                    poll = await Poll.get(poll_id)
                    if poll:
                        for opt in poll.options:
                            if opt.id == option_id:
                                opt.vote_count += 1
                                break
                        await poll.save()
                        
                        new_vote = Vote(
                            user_id=user_id,
                            poll_id=poll_id,
                            option_id=option_id
                        )
                        await new_vote.insert()
                        
                        # Invalidate cache
                        await redis.delete(f"poll_results:{poll_id}")
                        
        except Exception as e:
            await asyncio.sleep(1)

@app.on_event("startup")
async def start_db():
    await init_db()
    asyncio.create_task(process_vote_queue())
    
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
