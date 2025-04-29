// Базовый URL API
const API_URL = "http://localhost:8000/api";

// Функция для получения информации о пользователе по ID
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Пользователь не найден");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    throw error;
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    console.log("Отправка запроса на обновление профиля:", userData);

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept": "application/json"
      },
      credentials: "include", // Включаем отправку куки
      body: JSON.stringify(userData),
    });

    console.log("Статус ответа:", response.status);
    
    // Для отладки - выводим заголовки ответа
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Заголовки ответа:", headers);

    if (!response.ok) {
      let errorMessage = "Ошибка при обновлении профиля";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // Если не получилось распарсить JSON, используем текст ответа
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    throw error;
  }
};

// Функция для изменения пароля пользователя
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при изменении пароля");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при изменении пароля:", error);
    throw error;
  }
};

// Другие функции остаются без изменений
export const getUserAddresses = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/users/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении адресов");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении адресов:", error);
    throw error;
  }
};

export const addUserAddress = async (addressData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/users/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при добавлении адреса");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при добавлении адреса:", error);
    throw error;
  }
};

export const deleteUserAddress = async (addressId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`${API_URL}/users/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при удалении адреса");
    }

    return true;
  } catch (error) {
    console.error("Ошибка при удалении адреса:", error);
    throw error;
  }
};