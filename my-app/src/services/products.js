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

// Функция для создания нового продукта (только для админов)
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при создании товара");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    throw error;
  }
};

// Функция для обновления продукта (только для админов)
export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при обновлении товара");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    throw error;
  }
};

// Функция для удаления продукта (только для админов)
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при удалении товара");
    }

    return true;
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    throw error;
  }
};