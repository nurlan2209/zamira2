"""
Этот скрипт выполняет миграцию базы данных, добавляя новые поля в таблицу пользователей.
Запустите его как отдельный скрипт Python после остановки основного приложения.
"""

import os
import sys

# Добавляем корневую директорию проекта в путь
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, Column, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Импортируем необходимые модули из нашего приложения
from backend.database import SQLALCHEMY_DATABASE_URL

# Создаем подключение к базе данных
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Получаем сессию БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def run_migration():
    try:
        connection = engine.connect()

        # Проверка существования колонок
        has_first_name = connection.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='first_name'"
        )).fetchone() is not None

        has_last_name = connection.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='last_name'"
        )).fetchone() is not None

        has_address = connection.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='address'"
        )).fetchone() is not None

        has_phone = connection.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='phone'"
        )).fetchone() is not None

        has_is_admin = connection.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='users' AND column_name='is_admin'"
        )).fetchone() is not None

        # Добавление колонок
        if not has_first_name:
            logger.info("Добавление колонки first_name")
            connection.execute(text("ALTER TABLE users ADD COLUMN first_name VARCHAR(255)"))

        if not has_last_name:
            logger.info("Добавление колонки last_name")
            connection.execute(text("ALTER TABLE users ADD COLUMN last_name VARCHAR(255)"))

        if not has_address:
            logger.info("Добавление колонки address")
            connection.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(255)"))

        if not has_phone:
            logger.info("Добавление колонки phone")
            connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(255)"))

        if not has_is_admin:
            logger.info("Добавление колонки is_admin")
            connection.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))

        connection.close()
        logger.info("Миграция завершена успешно")

    except Exception as e:
        logger.error(f"Ошибка при выполнении миграции: {str(e)}")
        raise

if __name__ == "__main__":
    run_migration()