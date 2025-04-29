// Базовый URL API
const API_URL = "http://localhost:8000/api";

// Функция для входа пользователя
export const login = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/token`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка аутентификации");
    }

    const data = await response.json();
    // Сохраняем токен в localStorage
    localStorage.setItem("token", data.access_token);
    return data;
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
};

// Функция для регистрации пользователя
export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка регистрации");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw error;
  }
};

// Функция для выхода пользователя
export const logout = () => {
  localStorage.removeItem("token");
};

// Функция для проверки, авторизован ли пользователь
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Функция для получения данных текущего пользователя
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось получить данные пользователя");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка получения данных пользователя:", error);
    return null;
  }
};