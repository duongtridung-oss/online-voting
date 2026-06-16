from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from beanie import PydanticObjectId
import auth
from models import User, Poll, Vote

router = APIRouter(prefix="/api/admin", tags=["Admin"], dependencies=[Depends(auth.get_current_admin)])

class UserUpdate(BaseModel):
    role: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None

class StatsResponse(BaseModel):
    total_users: int
    total_polls: int
    total_votes: int
    active_users: int

@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    total_users = await User.count()
    total_polls = await Poll.count()
    total_votes = await Vote.count()
    active_users = await User.find(User.is_active == True).count()
    
    return {
        "total_users": total_users,
        "total_polls": total_polls,
        "total_votes": total_votes,
        "active_users": active_users
    }

@router.get("/users")
async def get_users(search: Optional[str] = None, role: Optional[str] = None):
    query = {}
    if search:
        query["$or"] = [
            {"username": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    if role and role != "all":
        query["role"] = role
        
    users = await User.find(query).to_list()
    return users

@router.put("/users/{user_id}")
async def update_user(user_id: PydanticObjectId, update_data: UserUpdate):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if update_data.role:
        user.role = update_data.role
    if update_data.email:
        user.email = update_data.email
    if update_data.username:
        user.username = update_data.username
        
    await user.save()
    return user

@router.patch("/users/{user_id}/toggle-lock")
async def toggle_user_lock(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_active = not user.is_active
    await user.save()
    return {"message": "User status toggled successfully", "is_active": user.is_active}

@router.delete("/users/{user_id}")
async def delete_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await user.delete()
    return {"message": "User deleted successfully"}
