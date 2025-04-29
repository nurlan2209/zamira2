import React, { useState, useEffect } from "react";
import "../../styles/AdminForms.css";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_active: true,
    is_admin: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(true);

  useEffect(() => {
    // Если редактируем существующего пользователя, заполняем форму его данными
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        // Пароль не передаем при редактировании
        password: "",
        is_active: user.is_active,
        is_admin: user.is_admin || false
      });
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Для чекбоксов используем checked, для остальных полей - value
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: inputValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!formData.username || !formData.email) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }
    
    // Если это новый пользователь, проверяем, что пароль указан
    if (isNewUser && !formData.password) {
      setError("Пожалуйста, укажите пароль для нового пользователя");
      return;
    }
    
    // Если редактируем пользователя и пароль пустой, исключаем его из данных
    const dataToSubmit = { ...formData };
    if (!isNewUser && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    
    onSubmit(dataToSubmit);
  };

  return (
    <div className="admin-form user-form">
      <h2>{isNewUser ? "Добавление пользователя" : "Редактирование пользователя"}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">
            {isNewUser ? "Пароль *" : "Новый пароль (оставьте пустым, чтобы не менять)"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required={isNewUser}
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
            Активный пользователь
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_admin"
              checked={formData.is_admin}
              onChange={handleInputChange}
            />
            Администратор
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить пользователя"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;