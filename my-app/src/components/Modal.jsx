import React, { useState } from "react";
import { login, register } from "../services/auth";

function Modal({ show, closeModal, isLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Вход пользователя
        await login(username, password);
      } else {
        // Регистрация пользователя
        await register(username, email, password);
      }
      // При успешной авторизации/регистрации закрываем модальное окно
      closeModal();
      // Обновляем страницу для применения изменений
      window.location.reload();
    } catch (err) {
      setError(err.message || "Произошла ошибка. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // Не рендерить, если модальное окно не открыто

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        
        <div className="switch-form-text">
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            className="switch-form-button"
            onClick={() => {
              setError("");
              setLoading(false);
              closeModal();
              // Открыть другое модальное окно
              window.setTimeout(() => {
                document.dispatchEvent(
                  new CustomEvent("openModal", { detail: { isLogin: !isLogin } })
                );
              }, 100);
            }}
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;