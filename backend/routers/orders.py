from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime

from backend.database import get_db
from backend.models.schemas import Order
from backend.models.database import Order as DBOrder, OrderItem
from backend.utils.auth import get_current_active_user

router = APIRouter(tags=["orders"])

@router.get("/orders", response_model=List[Order])
async def get_user_orders(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    orders = db.query(DBOrder).filter(DBOrder.user_id == current_user.id).all()
    return orders

@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: int, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    order = db.query(DBOrder).filter(DBOrder.id == order_id, DBOrder.user_id == current_user.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/orders", response_model=Order)
async def create_order(order_data: dict, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    # Создание нового заказа
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_order = DBOrder(
        user_id=current_user.id, 
        created_at=current_time,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Добавление товаров в заказ
    if "items" in order_data:
        for item_data in order_data["items"]:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data["product_id"],
                size=item_data.get("size", ""),
                quantity=item_data.get("quantity", 1)
            )
            db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.post("/orders/{order_id}/cancel", response_model=Order)
async def cancel_order(order_id: int, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    order = db.query(DBOrder).filter(DBOrder.id == order_id, DBOrder.user_id == current_user.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Проверка, можно ли отменить заказ
    if order.status not in ["pending", "processing"]:
        raise HTTPException(status_code=400, detail="Cannot cancel order with status: " + order.status)
    
    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    
    return order