// Базовый URL API
const API_URL = "http://localhost:8000/api";

// Функция для получения всех категорий
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error("Ошибка при получении категорий");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    throw error;
  }
};

// Функция для получения всех продуктов
export const getProducts = async (category = null, search = null) => {
  try {
    let url = `${API_URL}/products`;
    
    // Добавляем параметры запроса, если они указаны
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    
    // Если есть параметры, добавляем их к URL
    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка при получении продуктов");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    throw error;
  }
};

// Функция для получения конкретного продукта по ID
export const getProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error("Продукт не найден");
    }
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении продукта с ID ${productId}:`, error);
    throw error;
  }
};