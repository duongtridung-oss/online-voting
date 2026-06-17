from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import timedelta
import auth
from database import settings
from models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    voter_id: str
    address: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    is_active: bool
    full_name: Optional[str] = None
    voter_id: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    avatar_url: Optional[str] = None
    party: Optional[str] = None
    biography: Optional[str] = None
    symbol_url: Optional[str] = None
    is_profile_complete: bool

class ProfileUpdate(BaseModel):
    full_name: str
    voter_id: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    # Check existing user
    if await User.find_one(User.username == user_data.username):
        raise HTTPException(status_code=400, detail="Tên người dùng đã được đăng ký")
    if await User.find_one(User.email == user_data.email):
        raise HTTPException(status_code=400, detail="Email đã được đăng ký")
    if await User.find_one(User.voter_id == user_data.voter_id):
        raise HTTPException(status_code=400, detail="Mã cử tri đã được đăng ký")
    
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        voter_id=user_data.voter_id,
        address=user_data.address,
        role="user",
        is_profile_complete=True
    )
    await new_user.insert()
    
    return _user_to_response(new_user)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one({"$or": [{"username": form_data.username}, {"email": form_data.username}]})
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên người dùng hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        username=user.username,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        full_name=user.full_name,
        voter_id=user.voter_id,
        address=user.address,
        phone_number=user.phone_number,
        date_of_birth=user.date_of_birth,
        avatar_url=user.avatar_url,
        party=user.party,
        biography=user.biography,
        symbol_url=user.symbol_url,
        is_profile_complete=user.is_profile_complete
    )

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return _user_to_response(current_user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(auth.get_current_user)):
    current_user.full_name = profile_data.full_name
    current_user.voter_id = profile_data.voter_id
    current_user.address = profile_data.address
    current_user.phone_number = profile_data.phone_number
    current_user.date_of_birth = profile_data.date_of_birth
    current_user.is_profile_complete = True
    await current_user.save()
    
    return _user_to_response(current_user)

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    user = await User.find_one(User.email == request.email)
    if not user:
        # Simulate success to prevent email enumeration
        return {"message": "If that email exists, a reset link has been sent."}
    
    # In a real app, generate token and send email
    # Simulated token
    reset_token = auth.create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))
    return {"message": "If that email exists, a reset link has been sent.", "simulated_token_for_testing": reset_token}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    try:
        payload = auth.jwt.decode(request.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except auth.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    user = await User.find_one(User.username == username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = auth.get_password_hash(request.new_password)
    await user.save()
    return {"message": "Password has been reset successfully"}

@router.put("/change-password")
async def change_password(request: ChangePasswordRequest, current_user: User = Depends(auth.get_current_user)):
    if not auth.verify_password(request.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    current_user.hashed_password = auth.get_password_hash(request.new_password)
    await current_user.save()
    return {"message": "Password changed successfully"}
