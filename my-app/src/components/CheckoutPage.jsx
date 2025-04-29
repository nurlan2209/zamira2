import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/CheckoutPage.css";
import { createOrder, completeOrder } from "../services/orders";

export default function CheckoutPage({ user, openModal, onLogout }) {
  const location = useLocation();
  const { product, selectedSize } = location.state || {};
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Состояния для выбора способа доставки и оплаты
  const [deliveryMethod, setDeliveryMethod] = useState("самовывоз");
  const [showQRModal, setShowQRModal] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

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
      setEmail(user.email || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user, product, navigate, openModal]);

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Проверяем заполнение обязательных полей
      if (!firstName || !lastName || !email || !phoneNumber) {
        throw new Error("Пожалуйста, заполните все обязательные поля");
      }
      
      // Для способа доставки "Казпочта" или "Курьер" требуется адрес
      if ((deliveryMethod === "казпочта" || deliveryMethod === "курьер") && !address) {
        throw new Error("Для выбранного способа доставки необходимо указать адрес");
      }
      
      // Формируем данные заказа для API
      const orderData = {
        items: [
          {
            product_id: product.id,
            size: selectedSize,
            quantity: 1
          }
        ],
        // Дополнительные поля для сохранения информации о доставке
        // Эти поля можно передать в метаданных, если API их поддерживает
        // Или добавить в БД соответствующие поля
        delivery_method: deliveryMethod,
        delivery_address: address,
        contact_info: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phoneNumber
        }
      };
      
      // Создаем предварительный заказ через API
      const response = await createOrder(orderData);
      console.log("Заказ успешно создан:", response);
      
      // Показываем QR-код для оплаты
      setShowQRModal(true);
      setLoading(false);
      
    } catch (err) {
      setError(err.message || "Произошла ошибка при оформлении заказа");
      setLoading(false);
      console.error("Ошибка при создании заказа:", err);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // Имитируем обработку оплаты
      setLoading(true);
      
      // Формируем данные заказа для завершения
      const orderData = {
        product: product,
        selectedSize: selectedSize,
        delivery_method: deliveryMethod,
        delivery_address: address,
        contact_info: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phoneNumber
        }
      };
      
      // Сохраняем заказ в системе
      const completedOrder = await completeOrder(orderData);
      console.log("Заказ успешно оплачен и сохранен:", completedOrder);
      
      // Закрываем модальное окно с QR-кодом
      setShowQRModal(false);
      // Показываем сообщение об успешном оформлении заказа
      setOrderCompleted(true);
      
    } catch (err) {
      setError("Ошибка при обработке оплаты: " + err.message);
      console.error("Ошибка при обработке оплаты:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToOrders = () => {
    navigate("/profile");
    // Переключаемся на вкладку заказов в профиле
    localStorage.setItem('activeProfileTab', 'orders');
  };

  // Если нет товара или пользователя, показываем загрузку (пока не сработает редирект)
  if (!product || !user) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="checkout-page">
      {/* Шапка с навигацией и авторизацией */}
      <header className="checkout-header">
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

      {orderCompleted ? (
        <div className="order-success">
          <h2>Заказ успешно оформлен!</h2>
          <p>Спасибо за покупку в нашем магазине. Детали заказа отправлены на ваш email.</p>
          <div className="success-actions">
            <button onClick={handleGoToOrders} className="view-orders-button">
              Перейти к моим заказам
            </button>
            <button onClick={handleGoHome} className="go-home-button">
              Вернуться в магазин
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="checkout-title">Оформление заказа</h1>

          <div className="checkout-content">
            {/* Форма заказа */}
            <form onSubmit={handleSubmit} className="checkout-form">
              {error && <div className="error-message">{error}</div>}
              
              <h2>Контактная информация</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Имя *</label>
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
                  <label htmlFor="lastName">Фамилия *</label>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Электронная почта *</label>
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
                  <label htmlFor="phoneNumber">Номер телефона *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="+7 (___) ___-__-__"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <h2>Способ доставки</h2>
              
              <div className="delivery-methods">
                <div className="delivery-method">
                  <input
                    type="radio"
                    id="pickup"
                    name="deliveryMethod"
                    value="самовывоз"
                    checked={deliveryMethod === "самовывоз"}
                    onChange={() => handleDeliveryMethodChange("самовывоз")}
                  />
                  <label htmlFor="pickup">
                    <div className="method-name">Самовывоз</div>
                    <div className="method-desc">Бесплатно, получение в магазине</div>
                  </label>
                </div>
                
                <div className="delivery-method">
                  <input
                    type="radio"
                    id="kazpost"
                    name="deliveryMethod"
                    value="казпочта"
                    checked={deliveryMethod === "казпочта"}
                    onChange={() => handleDeliveryMethodChange("казпочта")}
                  />
                  <label htmlFor="kazpost">
                    <div className="method-name">Казпочта</div>
                    <div className="method-desc">От 500 тг., доставка 3-7 дней</div>
                  </label>
                </div>
                
                <div className="delivery-method">
                  <input
                    type="radio"
                    id="courier"
                    name="deliveryMethod"
                    value="курьер"
                    checked={deliveryMethod === "курьер"}
                    onChange={() => handleDeliveryMethodChange("курьер")}
                  />
                  <label htmlFor="courier">
                    <div className="method-name">Курьерская доставка</div>
                    <div className="method-desc">От 1000 тг., доставка на следующий день</div>
                  </label>
                </div>
              </div>
              
              {(deliveryMethod === "казпочта" || deliveryMethod === "курьер") && (
                <div className="form-group">
                  <label htmlFor="address">Адрес доставки *</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Введите полный адрес доставки"
                    disabled={loading}
                    rows="3"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="checkout-button"
                disabled={loading}
              >
                {loading ? "Оформление заказа..." : "Оформить заказ"}
              </button>
            </form>

            {/* Отображение выбранного товара */}
            <div className="product-summary">
              <h2>Ваш заказ</h2>
              <div className="product-info">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <p className="product-size">Размер: {selectedSize}</p>
                  <p className="product-price">${product.price}</p>
                </div>
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Товар:</span>
                  <span>${product.price}</span>
                </div>
                <div className="summary-row">
                  <span>Доставка:</span>
                  <span>
                    {deliveryMethod === "самовывоз" ? "Бесплатно" :
                     deliveryMethod === "казпочта" ? "500 тг." : "1000 тг."}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Итого:</span>
                  <span>
                    ${deliveryMethod === "самовывоз" ? product.price :
                      deliveryMethod === "казпочта" ? (product.price + 1.1).toFixed(2) :
                      (product.price + 2.2).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Модальное окно с QR-кодом для оплаты */}
      {showQRModal && (
        <div className="modal-overlay">
          <div className="modal-content qr-modal">
            <button className="close-button" onClick={() => setShowQRModal(false)}>
              &times;
            </button>
            
            <h2>Оплата заказа</h2>
            <p>Отсканируйте QR-код для оплаты вашего заказа</p>
            
            <div className="qr-code">
              <img src="/images/payment-qr.png" alt="QR-код для оплаты" />
            </div>
            
            <p className="qr-instructions">
              После оплаты, статус заказа будет автоматически обновлен, и вы получите уведомление по email.
            </p>
            
            {/* Кнопка для имитации завершения оплаты */}
            <button className="payment-complete-btn" onClick={handlePaymentComplete}>
              Я оплатил заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}