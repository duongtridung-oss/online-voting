from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, admin, polls

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

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/")
async def root():
    return {"message": "VoteCast API đang hoạt động!"}
