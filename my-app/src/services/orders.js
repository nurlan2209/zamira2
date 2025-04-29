// Базовый URL API
const API_URL = "http://localhost:8000/api";

// Функция для получения всех заказов пользователя
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/orders`, {
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

// Функция для получения конкретного заказа по ID
export const getOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Заказ не найден");
    }

    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении заказа с ID ${orderId}:`, error);
    throw error;
  }
};

// Функция для создания нового заказа
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при создании заказа");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    throw error;
  }
};

// Вспомогательная функция для форматирования даты заказа
export const formatOrderDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Функция для определения статуса заказа на русском языке
export const getOrderStatusText = (status) => {
  const statusMap = {
    pending: "В обработке",
    processing: "Обрабатывается",
    shipped: "Отправлен",
    delivered: "Доставлен",
    completed: "Выполнен",
    cancelled: "Отменен"
  };
  
  return statusMap[status] || status;
};

// Функция для отмены заказа (если разрешено)
export const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Не удалось отменить заказ");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при отмене заказа:", error);
    throw error;
  }
};