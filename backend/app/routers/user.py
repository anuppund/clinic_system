from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..models import User
from ..dependencies import get_db
from ..auth import hash_password, verify_password, create_access_token
from ..security import get_current_user
from ..role_checker import admin_required
from ..schemas import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first(): raise HTTPException(status_code=400, detail="Email exists")
    db.add(User(name=user.name, email=user.email, password=hash_password(user.password), role=user.role))
    db.commit()
    return {"message": "Created"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password): raise HTTPException(status_code=401)
    return {"access_token": create_access_token({"sub": user.email, "role": user.role, "user_id": user.id}), "token_type": "bearer", "user": {"id": user.id, "name": user.name, "role": user.role}}

@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == current_user["id"]).first()

@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["admin", "doctor"]: raise HTTPException(status_code=403)
    return db.query(User).all()

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), _: dict = Depends(admin_required)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="Not Found")
    user.name = data.name; user.email = data.email; user.role = data.role
    db.commit(); db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: dict = Depends(admin_required)):
    user = db.query(User).filter(User.id == user_id).first()
    if user: db.delete(user); db.commit()
    return {"message": "Deleted"}
