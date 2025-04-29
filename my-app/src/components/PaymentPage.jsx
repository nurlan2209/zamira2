import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/PaymentPage.css";

export default function PaymentPage({ user, openModal, onLogout }) {
  const location = useLocation();
  const { product, selectedSize } = location.state || {};
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Проверяем, авторизован ли пользователь и есть ли товар
  useEffect(() => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на главную и открываем окно авторизации
      navigate("/");
      setTimeout(() => {
        openModal(true);
      }, 100);
    }
    
    if (!product) {
      // Если нет информации о товаре, перенаправляем на главную
      navigate("/");
    }
    
    // Если пользователь авторизован, заполняем email из данных пользователя
    if (user) {
      setEmail(user.email);
    }
  }, [user, product, navigate, openModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // В реальном приложении здесь будет запрос к API для создания заказа
      // Имитируем задержку для демонстрации
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Пример запроса к API, который можно будет использовать в будущем:
      /*
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: [{
            product_id: product.id,
            size: selectedSize,
            quantity: 1
          }],
          shipping_info: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phoneNumber,
            address: address
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при создании заказа');
      }
      */
      
      setPaymentSuccess(true);
    } catch (err) {
      setError(err.message || "Произошла ошибка при обработке заказа");
      console.error("Ошибка при создании заказа:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Если нет товара или пользователя, показываем загрузку (пока не сработает редирект)
  if (!product || !user) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="payment-page">
      {/* Шапка с навигацией и авторизацией */}
      <header className="payment-header">
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

      <h1 className="payment-title">Оформление заказа</h1>

      {paymentSuccess ? (
        <div className="payment-success">
          <h2>Заказ успешно оформлен!</h2>
          <p>Спасибо за покупку в нашем магазине. Детали заказа отправлены на ваш email.</p>
          <button onClick={handleGoHome} className="go-home-button">
            Вернуться в магазин
          </button>
        </div>
      ) : (
        <div className="payment-content">
          {/* Форма оплаты */}
          <form onSubmit={handleSubmit} className="payment-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Введите ваше имя"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Введите вашу фамилию"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Электронная почта</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Введите ваш email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Номер телефона</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Введите номер телефона"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Адрес доставки</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Введите адрес доставки"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Обработка..." : "Оформить заказ"}
            </button>
          </form>

          {/* Отображение выбранного товара */}
          <div className="product-summary">
            <h3>Ваш заказ</h3>
            <div className="product-info">
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p className="price">${product.price}</p>
                <p>Размер: {selectedSize}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}