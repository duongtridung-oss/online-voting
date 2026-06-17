from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from beanie import PydanticObjectId
import auth
from models import User, Poll, Vote, PollOption

router = APIRouter(prefix="/api/polls", tags=["Polls"])

class PollCreate(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    options: List[PollOption]

class PollUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class VoteRequest(BaseModel):
    option_id: str

@router.get("/")
async def get_polls(search: Optional[str] = None, status: Optional[str] = None):
    query = {}
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if status and status != "all":
        query["status"] = status
        
    polls = await Poll.find(query).to_list()
    return polls

@router.get("/{poll_id}")
async def get_poll(poll_id: PydanticObjectId):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll

@router.post("/", dependencies=[Depends(auth.get_current_admin)])
async def create_poll(poll_data: PollCreate, current_user: User = Depends(auth.get_current_admin)):
    poll = Poll(
        title=poll_data.title,
        description=poll_data.description,
        start_time=poll_data.start_time,
        end_time=poll_data.end_time,
        options=poll_data.options,
        created_by=current_user.username
    )
    await poll.insert()
    return poll

@router.put("/{poll_id}", dependencies=[Depends(auth.get_current_admin)])
async def update_poll(poll_id: PydanticObjectId, update_data: PollUpdate):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
        
    if update_data.title: poll.title = update_data.title
    if update_data.description: poll.description = update_data.description
    if update_data.start_time: poll.start_time = update_data.start_time
    if update_data.end_time: poll.end_time = update_data.end_time
    
    await poll.save()
    return poll

@router.delete("/{poll_id}", dependencies=[Depends(auth.get_current_admin)])
async def delete_poll(poll_id: PydanticObjectId):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    await poll.delete()
    return {"message": "Poll deleted successfully"}

@router.patch("/{poll_id}/close", dependencies=[Depends(auth.get_current_admin)])
async def close_poll(poll_id: PydanticObjectId):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    poll.status = "closed"
    await poll.save()
    return poll

@router.patch("/{poll_id}/reopen", dependencies=[Depends(auth.get_current_admin)])
async def reopen_poll(poll_id: PydanticObjectId):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    poll.status = "open"
    await poll.save()
    return poll

@router.post("/{poll_id}/vote")
async def vote_poll(poll_id: PydanticObjectId, vote_req: VoteRequest, current_user: User = Depends(auth.get_current_user)):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
        
    if poll.status != "open":
        raise HTTPException(status_code=400, detail="Kỳ bầu cử chưa mở hoặc đã đóng.")
        
    if not current_user.is_profile_complete:
        raise HTTPException(status_code=403, detail="Vui lòng hoàn thiện thông tin cá nhân trước khi bình chọn.")
        
    now = datetime.now(timezone.utc)
    start = poll.start_time.replace(tzinfo=timezone.utc) if poll.start_time.tzinfo is None else poll.start_time
    end = poll.end_time.replace(tzinfo=timezone.utc) if poll.end_time.tzinfo is None else poll.end_time
    
    if not (start <= now <= end):
        raise HTTPException(status_code=400, detail="Hiện không nằm trong thời gian bỏ phiếu hợp lệ.")
        
    # Check if user already voted
    existing_vote = await Vote.find_one(Vote.user_id == str(current_user.id), Vote.poll_id == str(poll_id))
    if existing_vote:
        raise HTTPException(status_code=400, detail="Bạn đã bỏ phiếu cho kỳ bầu cử này rồi.")
        
    # Update vote count safely
    option_found = False
    for opt in poll.options:
        if opt.id == vote_req.option_id:
            opt.vote_count += 1
            option_found = True
            break
            
    if not option_found:
        raise HTTPException(status_code=400, detail="Tùy chọn ứng viên không hợp lệ.")
        
    await poll.save()
    
    # Save Vote record
    new_vote = Vote(
        user_id=str(current_user.id),
        poll_id=str(poll_id),
        option_id=vote_req.option_id
    )
    await new_vote.insert()
    
    return {"message": "Vote recorded successfully"}

@router.get("/{poll_id}/results")
async def get_poll_results(poll_id: PydanticObjectId):
    poll = await Poll.get(poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll.options

@router.get("/{poll_id}/export", dependencies=[Depends(auth.get_current_admin)])
async def export_poll_results(poll_id: PydanticObjectId, format: str = "excel"):
    # Dummy endpoint
    return {"message": f"Exported poll {poll_id} results to {format}"}
