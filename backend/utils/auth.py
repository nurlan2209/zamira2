from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.models.schemas import TokenData
from backend.models.database import User
from backend.database import get_db

# Настройки для JWT
SECRET_KEY = "your-secret-key"  # В реальном проекте используйте безопасный секретный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Настройка контекста для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 с Bearer токеном
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Функция для верификации пароля
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Функция для хеширования пароля
def get_password_hash(password):
    return pwd_context.hash(password)

# Функция для получения пользователя по имени пользователя
def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# Функция для аутентификации пользователя
def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Функция для создания access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Функция для получения текущего пользователя
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Функция для получения текущего активного пользователя
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user