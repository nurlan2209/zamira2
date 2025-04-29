from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, Base
from backend.routers import auth, products, users, orders, admin

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

# Создаем экземпляр FastAPI
app = FastAPI(title="Shop API")

# Настройка CORS для интеграции с фронтендом
origins = [
    "http://localhost:5173",  # Адрес фронтенда (Vite)
    "http://localhost:3000",  # Альтернативный адрес фронтенда
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Явно указываем все методы
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Время кеширования предварительных запросов в секундах
)

# Подключаем роутеры
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}