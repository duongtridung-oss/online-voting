from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from beanie import PydanticObjectId
import auth
from models import Candidate

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

class CandidateCreate(BaseModel):
    full_name: str
    age: int
    party: str
    biography: str
    avatar_url: Optional[str] = None
    symbol_url: Optional[str] = None

class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    party: Optional[str] = None
    biography: Optional[str] = None
    avatar_url: Optional[str] = None
    symbol_url: Optional[str] = None

@router.get("/", response_model=List[Candidate])
async def get_candidates(search: Optional[str] = None):
    query = {}
    if search:
        query["full_name"] = {"$regex": search, "$options": "i"}
    candidates = await Candidate.find(query).to_list()
    return candidates

@router.get("/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: PydanticObjectId):
    candidate = await Candidate.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.post("/", response_model=Candidate, dependencies=[Depends(auth.get_current_admin)])
async def create_candidate(candidate_data: CandidateCreate):
    new_candidate = Candidate(**candidate_data.dict())
    await new_candidate.insert()
    return new_candidate

@router.put("/{candidate_id}", response_model=Candidate, dependencies=[Depends(auth.get_current_admin)])
async def update_candidate(candidate_id: PydanticObjectId, update_data: CandidateUpdate):
    candidate = await Candidate.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(candidate, key, value)
        
    await candidate.save()
    return candidate

@router.delete("/{candidate_id}", dependencies=[Depends(auth.get_current_admin)])
async def delete_candidate(candidate_id: PydanticObjectId):
    candidate = await Candidate.get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    await candidate.delete()
    return {"message": "Candidate deleted successfully"}
