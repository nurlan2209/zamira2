from typing import List, Optional
from pydantic import BaseModel

# Схемы для пользователей
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    is_active: bool
    address: Optional[str] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = False
    
    class Config:
        orm_mode = True

# Схемы для аутентификации
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Остальные схемы остаются без изменений
# Схемы для категорий
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        orm_mode = True

# Схемы для размеров товаров
class ProductSizeBase(BaseModel):
    size: str

class ProductSizeCreate(ProductSizeBase):
    pass

class ProductSize(ProductSizeBase):
    id: int
    product_id: int
    
    class Config:
        orm_mode = True

# Схемы для товаров
class ProductBase(BaseModel):
    name: str
    price: float
    image_url: str
    description: Optional[str] = None
    category_id: int

class ProductCreate(ProductBase):
    sizes: List[str]

class Product(ProductBase):
    id: int
    sizes: List[ProductSize] = []
    
    class Config:
        orm_mode = True

# Схемы для элементов заказа
class OrderItemBase(BaseModel):
    product_id: int
    size: str
    quantity: int = 1

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    
    class Config:
        orm_mode = True

# Схемы для заказов
class OrderBase(BaseModel):
    pass

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    created_at: str
    status: str
    items: List[OrderItem] = []
    
    class Config:
        orm_mode = True