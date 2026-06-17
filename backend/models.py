from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timezone
import pymongo

class User(Document):
    username: str
    email: EmailStr
    hashed_password: str
    role: str = "user" # "admin" | "user"
    is_active: bool = True
    avatar_url: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    voter_id: Optional[str] = None
    party: Optional[str] = None
    biography: Optional[str] = None
    symbol_url: Optional[str] = None
    is_profile_complete: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

class PollOption(BaseModel):
    id: str
    name: str
    description: str
    candidate_id: Optional[str] = None
    vote_count: int = 0
    order: int = 0

class Candidate(Document):
    full_name: str
    age: int
    party: str
    biography: str
    avatar_url: Optional[str] = None
    symbol_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "candidates"

class Poll(Document):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    status: str = "upcoming" # "upcoming" | "open" | "closed"
    options: List[PollOption]
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "polls"

class Vote(Document):
    user_id: str
    poll_id: str
    option_id: str
    voted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "votes"
        indexes = [
            [("user_id", pymongo.ASCENDING), ("poll_id", pymongo.ASCENDING)] # Compound unique index
        ]

class Notification(Document):
    user_id: str # "all" for system-wide
    title: str
    message: str
    type: str # "system" | "poll_update"
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "notifications"

class ActivityLog(Document):
    user_id: str
    action_type: str # "login" | "vote" | "create_poll" | etc.
    description: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "activity_logs"

class SystemSettings(Document):
    allow_vote_cancellation: bool = False
    maintenance_mode: bool = False
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "system_settings"
