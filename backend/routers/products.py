from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.schemas import Product, ProductCreate, Category, CategoryCreate
from backend.models.database import Product as DBProduct, Category as DBCategory, ProductSize
from backend.utils.auth import get_current_active_user

router = APIRouter(tags=["products"])

# Эндпоинты для категорий

@router.get("/categories", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(DBCategory).all()
    return categories

@router.post("/categories", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = DBCategory(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Эндпоинты для товаров

@router.get("/products", response_model=List[Product])
def get_products(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(DBProduct)
    
    # Фильтрация по категории
    if category:
        db_category = db.query(DBCategory).filter(DBCategory.name == category).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        query = query.filter(DBProduct.category_id == db_category.id)
    
    # Поиск по имени товара
    if search:
        query = query.filter(DBProduct.name.ilike(f"%{search}%"))
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(DBProduct).filter(DBProduct.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/products", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    # Проверяем, что категория существует
    db_category = db.query(DBCategory).filter(DBCategory.id == product.category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Создаем новый товар
    db_product = DBProduct(
        name=product.name,
        price=product.price,
        image_url=product.image_url,
        description=product.description,
        category_id=product.category_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Добавляем размеры для товара
    for size in product.sizes:
        db_size = ProductSize(product_id=db_product.id, size=size)
        db.add(db_size)
    
    db.commit()
    db.refresh(db_product)
    return db_product