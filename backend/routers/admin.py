from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.schemas import User, Product, Category
from backend.models.database import User as DBUser, Product as DBProduct, Category as DBCategory
from backend.utils.auth import get_current_active_user

# Middleware для проверки прав администратора
def get_admin_user(current_user = Depends(get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав администратора"
        )
    return current_user

router = APIRouter(tags=["admin"])

# Эндпоинты для управления пользователями
@router.get("/admin/users", response_model=List[User])
async def get_users(current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    users = db.query(DBUser).all()
    return users

@router.get("/admin/users/{user_id}", response_model=User)
async def get_user(user_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

@router.put("/admin/users/{user_id}", response_model=User)
async def update_user(
    user_id: int, 
    user_data: dict = Body(...), 
    current_user = Depends(get_admin_user), 
    db: Session = Depends(get_db)
):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    for key, value in user_data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    db.delete(user)
    db.commit()
    return {"message": f"Пользователь с ID {user_id} удален"}

# Эндпоинты для управления товарами
@router.get("/admin/products", response_model=List[Product])
async def get_products(current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    products = db.query(DBProduct).all()
    return products

@router.post("/admin/products", response_model=Product)
async def create_product(
    product_data: dict = Body(...), 
    current_user = Depends(get_admin_user), 
    db: Session = Depends(get_db)
):
    # Проверка существования категории
    category_id = product_data.get('category_id')
    if category_id:
        category = db.query(DBCategory).filter(DBCategory.id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Создание продукта
    new_product = DBProduct(
        name=product_data.get('name'),
        price=product_data.get('price'),
        description=product_data.get('description', ''),
        image_url=product_data.get('image_url'),
        category_id=category_id
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    # Добавление размеров, если они указаны
    sizes = product_data.get('sizes', [])
    if sizes and isinstance(sizes, list):
        from backend.models.database import ProductSize
        for size in sizes:
            db_size = ProductSize(product_id=new_product.id, size=size)
            db.add(db_size)
        
        db.commit()
        db.refresh(new_product)
    
    return new_product

@router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(
    product_id: int, 
    product_data: dict = Body(...), 
    current_user = Depends(get_admin_user), 
    db: Session = Depends(get_db)
):
    product = db.query(DBProduct).filter(DBProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    
    # Обновляем поля товара
    for key, value in product_data.items():
        if hasattr(product, key) and key != 'sizes':
            setattr(product, key, value)
    
    # Обновляем размеры, если они указаны
    if 'sizes' in product_data and isinstance(product_data['sizes'], list):
        # Удаляем старые размеры
        from backend.models.database import ProductSize
        db.query(ProductSize).filter(ProductSize.product_id == product_id).delete()
        
        # Добавляем новые размеры
        for size in product_data['sizes']:
            db_size = ProductSize(product_id=product_id, size=size)
            db.add(db_size)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/admin/products/{product_id}")
async def delete_product(product_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    product = db.query(DBProduct).filter(DBProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    
    # Удаляем связанные размеры
    from backend.models.database import ProductSize
    db.query(ProductSize).filter(ProductSize.product_id == product_id).delete()
    
    # Удаляем сам товар
    db.delete(product)
    db.commit()
    return {"message": f"Товар с ID {product_id} удален"}

# Эндпоинты для управления категориями
@router.get("/admin/categories", response_model=List[Category])
async def get_categories(current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    categories = db.query(DBCategory).all()
    return categories

@router.post("/admin/categories", response_model=Category)
async def create_category(
    category_data: dict = Body(...), 
    current_user = Depends(get_admin_user), 
    db: Session = Depends(get_db)
):
    name = category_data.get('name')
    if not name:
        raise HTTPException(status_code=400, detail="Требуется указать название категории")
    
    # Проверка на дубликат
    existing = db.query(DBCategory).filter(DBCategory.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Категория с таким названием уже существует")
    
    new_category = DBCategory(name=name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    return new_category

@router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    category = db.query(DBCategory).filter(DBCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Проверка, есть ли товары в этой категории
    products_count = db.query(DBProduct).filter(DBProduct.category_id == category_id).count()
    if products_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Невозможно удалить категорию, так как она содержит {products_count} товаров"
        )
    
    db.delete(category)
    db.commit()
    return {"message": f"Категория с ID {category_id} удалена"}