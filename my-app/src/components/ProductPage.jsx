import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductePage.css";
import "../styles/ModalStyles.css";
import { getProduct } from "../services/products";

export default function ProductPage({ user, openModal, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Загружаем данные о продукте при монтировании компонента
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить товар");
        console.error("Ошибка при загрузке товара:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleOrderClick = () => {
    // Проверяем авторизацию пользователя перед оформлением заказа
    if (!user) {
      // Если пользователь не авторизован, показываем модальное окно входа
      openModal(true);
      return;
    }
    
    // Переход на страницу оплаты с передачей товара и выбранного размера
    navigate("/payment", { state: { product, selectedSize } });
  };

  return (
    <div className="product-page">
      {/* Шапка с навигацией и авторизацией */}
      <header className="product-header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">MØRK STORE</Link>
          </div>
          
          <div className="auth-panel">
            {user ? (
              <div className="user-info">
                <span className="username">Привет, {user.username}!</span>
                <button onClick={onLogout} className="logout-btn">Выйти</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={() => openModal(true)} className="login-btn">Войти</button>
                <button onClick={() => openModal(false)} className="register-btn">Регистрация</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Индикатор загрузки */}
      {loading && (
        <div className="loading">
          <p>Загрузка товара...</p>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <div className="error">
          <p>{error}</p>
          <Link to="/" className="back-link">Вернуться на главную</Link>
        </div>
      )}

      {/* Основной контент товара (показываем только если не загрузка и нет ошибок) */}
      {!loading && !error && product && (
        <>
          {/* Основная информация о товаре */}
          <div className="product-info">
            <div className="product-image">
              <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-details">
              <h1>{product.name}</h1>
              <p>{product.description || "Описание товара отсутствует."}</p>
              <p className="price">${product.price} </p>

              {/* Отображение размеров */}
              <div className="sizes">
                <h3>Доступные размеры:</h3>
                <ul>
                  {product.sizes && product.sizes.map((sizeObj, index) => (
                    <li key={index}>
                      <button
                        className={`size-btn ${
                          selectedSize === sizeObj.size ? "selected" : ""
                        }`}
                        onClick={() => handleSizeClick(sizeObj.size)}>
                        {sizeObj.size}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Кнопка заказать */}
              <button
                className="order-button"
                onClick={handleOrderClick}
                disabled={!selectedSize}>
                {user ? "Заказать" : "Войти и заказать"}
              </button>

              {/* Если есть рейтинг, отображаем его */}
              {product.rating && (
                <div className="rating">
                  <p>Рейтинг: {product.rating} / 5</p>
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`star ${
                          index < Math.round(product.rating) ? "filled" : ""
                        }`}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Отзывы - заглушка, так как в текущем API нет отзывов */}
          <div className="reviews">
            <h2>Отзывы о товаре</h2>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="review">
                  <p>
                    <strong>{review.user}</strong>: {review.review}
                  </p>
                  {review.rating && (
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`star ${
                            index < Math.round(review.rating) ? "filled" : ""
                          }`}>
                          &#9733;
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-reviews">У этого товара пока нет отзывов.</p>
            )}
          </div>
        </>
      )}

      {/* Показываем "Товар не найден", если не загружается и нет ошибок, но и товара тоже нет */}
      {!loading && !error && !product && (
        <div className="not-found">
          <h2>Товар не найден</h2>
          <p>К сожалению, запрашиваемый товар не существует или был удален.</p>
          <Link to="/" className="back-link">Вернуться на главную</Link>
        </div>
      )}

      {/* Навигация обратно */}
      <div className="back-navigation">
        <Link to="/" className="back-link">← Вернуться к списку товаров</Link>
      </div>
    </div>
  );
}