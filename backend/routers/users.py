from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
import logging

from backend.database import get_db
from backend.models.schemas import User, UserUpdate
from backend.models.database import User as DBUser
from backend.utils.auth import get_current_active_user

# Настраиваем логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["users"])

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/users/me", response_model=User)
async def update_users_me(
    user_data: UserUpdate = Body(...), 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Updating user profile: {user_data}")
        # Получаем пользователя из базы данных
        db_user = db.query(DBUser).filter(DBUser.id == current_user.id).first()
        if not db_user:
            logger.error(f"User not found: {current_user.id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        # Обновляем данные пользователя только для полей, которые указаны
        update_data = user_data.dict(exclude_unset=True)
        logger.info(f"Update data: {update_data}")
        for key, value in update_data.items():
            if hasattr(db_user, key):
                setattr(db_user, key, value)
            else:
                logger.warning(f"Field not found in model: {key}")
        
        db.commit()
        db.refresh(db_user)
        logger.info(f"User profile updated successfully: {db_user.id}")
        return db_user
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user