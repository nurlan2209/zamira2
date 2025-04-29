import uvicorn

if __name__ == "__main__":
    # Обратите внимание: точка перед backend указывает на то, что это модуль,
    # а не часть пути файла. Если run.py находится в корне проекта, то backend
    # должен быть доступен как модуль.
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)