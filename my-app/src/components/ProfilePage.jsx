import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";
import { updateUserProfile } from "../services/users";
import { getUserOrders } from "../services/orders";

export default function ProfilePage({ user, onLogout, openModal }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    address: "",
    phone: ""
  });

  const navigate = useNavigate();

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    if (!user) {
      navigate("/");
      setTimeout(() => {
        openModal(true);
      }, 100);
      return;
    }

    // Инициализируем данные формы из данных пользователя
    setEditedUser({
      username: user.username || "",
      email: user.email || "",
      address: user.address || "",
      phone: user.phone || ""
    });

    // Проверяем, был ли запрос на переход к заказам
    const savedTab = localStorage.getItem('activeProfileTab');
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem('activeProfileTab'); // Удаляем параметр после использования
    }

    // Загружаем заказы пользователя если активна вкладка заказов
    if (activeTab === "orders" || savedTab === "orders") {
      fetchOrders();
    }
  }, [user, activeTab, navigate, openModal]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getUserOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить заказы. Пожалуйста, попробуйте позже.");
      console.error("Ошибка при загрузке заказов:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
    console.log("Изменено поле:", name, "новое значение:", value);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError(null);
    // Сбрасываем изменения, если выходим из режима редактирования
    if (editMode) {
      setEditedUser({
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      console.log("Отправка данных профиля:", editedUser);
      
      // Подготовка данных - отправляем только измененные поля
      const dataToSend = {};
      if (editedUser.username !== (user.username || "")) dataToSend.username = editedUser.username;
      if (editedUser.email !== (user.email || "")) dataToSend.email = editedUser.email;
      if (editedUser.address !== (user.address || "")) dataToSend.address = editedUser.address;
      if (editedUser.phone !== (user.phone || "")) dataToSend.phone = editedUser.phone;
      
      console.log("Отправка только измененных данных:", dataToSend);

      // Проверяем, есть ли данные для отправки
      if (Object.keys(dataToSend).length === 0) {
        console.log("Нет измененных данных, закрываем режим редактирования");
        setEditMode(false);
        return;
      }
      
      const updatedUser = await updateUserProfile(dataToSend);
      console.log("Профиль успешно обновлен:", updatedUser);
      
      setEditMode(false);
      
      // Обновляем пользователя (в реальном приложении нужно обновить состояние пользователя)
      alert("Профиль успешно обновлен!");
      
      // Здесь можно было бы обновить данные пользователя в родительском компоненте,
      // например, через callback функцию
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
      setError(err.message || "Не удалось обновить профиль. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === "orders") {
      fetchOrders();
    }
  };

  // Если пользователь не авторизован, отображаем загрузку (пока не произойдет перенаправление)
  if (!user) {
    return <div className="loading">Загрузка...</div>;
  }

  // Функция для безопасного отображения данных заказа
  const safeRenderOrderItem = (item) => {
    return (
      <div key={item.id || Math.random()} className="order-item">
        {/* Проверяем наличие объекта product и его свойств */}
        <div className="item-image-container">
          {item.product && item.product.image_url ? (
            <img 
              src={item.product.image_url} 
              alt={item.product.name || 'Товар'} 
              className="item-image"
            />
          ) : (
            <div className="placeholder-image">Нет изображения</div>
          )}
        </div>

        <div className="item-details">
          <h4>
            {item.product && item.product.name 
              ? item.product.name 
              : 'Информация о товаре недоступна'}
          </h4>
          <p>Размер: {item.size || 'Не указан'}</p>
          <p>Количество: {item.quantity || 1}</p>
          {item.product && item.product.price !== undefined && (
            <p className="item-price">
              ${typeof item.product.price === 'number' 
                ? item.product.price.toFixed(2) 
                : item.product.price}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Функция для безопасного отображения заказов
  const renderOrders = () => {
    if (!orders || orders.length === 0) {
      return (
        <div className="no-orders">
          <p>У вас пока нет заказов.</p>
          <Link to="/" className="shop-link">
            Перейти к покупкам
          </Link>
        </div>
      );
    }

    return (
      <div className="orders-list">
        {orders.map(order => {
          // Безопасно обрабатываем каждый заказ
          return (
            <div key={order.id || Math.random()} className="order-card">
              <div className="order-header">
                <h3>Заказ #{order.id || 'Новый'}</h3>
                <span className={`order-status ${order.status || 'pending'}`}>
                  {order.status === "pending" ? "В обработке" :
                   order.status === "completed" ? "Выполнен" :
                   order.status === "shipped" ? "Отправлен" : 
                   order.status || "В обработке"}
                </span>
              </div>
              
              <p className="order-date">
                Дата заказа: {order.created_at 
                  ? new Date(order.created_at).toLocaleDateString() 
                  : new Date().toLocaleDateString()}
              </p>
              
              <div className="order-items">
                {Array.isArray(order.items) 
                  ? order.items.map(item => safeRenderOrderItem(item))
                  : <p>Детали заказа недоступны</p>
                }
              </div>
              
              <div className="order-total">
                <h4>Итого: ${order.total_price 
                  ? (typeof order.total_price === 'number' 
                      ? order.total_price.toFixed(2) 
                      : order.total_price)
                  : '0.00'}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="profile-page">
      {/* Шапка с навигацией */}
      <header className="profile-header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">MØRK STORE</Link>
          </div>
          <div className="user-info">
            <span className="username">Привет, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">Выйти</button>
          </div>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src="/images/default-avatar.png" alt="Аватар пользователя" />
            <h3>{user.username}</h3>
          </div>
          <ul className="profile-nav">
            <li 
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => handleTabClick("profile")}
            >
              Личные данные
            </li>
            <li 
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => handleTabClick("orders")}
            >
              Мои заказы
            </li>
            <li 
              className={activeTab === "favorites" ? "active" : ""}
              onClick={() => handleTabClick("favorites")}
            >
              Избранное
            </li>
          </ul>
        </div>

        <div className="profile-content">
          {error && <div className="error-message">{error}</div>}
          
          {activeTab === "profile" && (
            <div className="profile-info">
              <h2>Личные данные</h2>
              
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="username">Имя пользователя:</label>
                  {editMode ? (
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="info-value">{user.username}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  {editMode ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="info-value">{user.email}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Адрес доставки:</label>
                  {editMode ? (
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={editedUser.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="info-value">{user.address || "Не указан"}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Номер телефона:</label>
                  {editMode ? (
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="info-value">{user.phone || "Не указан"}</p>
                  )}
                </div>
                
                <div className="form-actions">
                  {editMode ? (
                    <>
                      <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "Сохранение..." : "Сохранить"}
                      </button>
                      <button type="button" className="cancel-btn" onClick={toggleEditMode}>
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button type="button" className="edit-btn" onClick={toggleEditMode}>
                      Редактировать
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>Мои заказы</h2>
              
              {loading ? (
                <div className="loading">Загрузка заказов...</div>
              ) : (
                renderOrders()
              )}
            </div>
          )}
          
          {activeTab === "favorites" && (
            <div className="favorites-section">
              <h2>Избранное</h2>
              <p>Функция находится в разработке.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}