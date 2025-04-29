// Базовый URL API
const API_URL = "http://localhost:8000/api";

// Функция для получения всех пользователей (только для админов)
export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении пользователей");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    throw error;
  }
};

// Функция для создания нового пользователя (только для админов)
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при создании пользователя");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

// Функция для обновления пользователя (только для админов)
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при обновлении пользователя");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw error;
  }
};

// Функция для удаления пользователя (только для админов)
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при удалении пользователя");
    }

    return true;
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    throw error;
  }
};

// Обновление функций для продуктов (с правами админа)
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

// Получение и управление заказами (для админа)
export const getOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении заказов");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при обновлении статуса заказа");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    throw error;
  }
};