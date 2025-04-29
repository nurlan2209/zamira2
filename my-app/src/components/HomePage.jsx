import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../styles/ModalStyles.css";
import { getProducts } from "../services/products";

export default function HomePage({ openModal: handleOpenModal, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Загрузка продуктов с бэкенда
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryParam = selectedCategory === "All" ? null : selectedCategory;
        const data = await getProducts(categoryParam, searchQuery || null);
        setProducts(data);
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
        setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Навигационное меню + Профиль */}
      <header className="fixed-header">
        <nav>
          <ul className="flex gap-4 flex-wrap justify-between">
            <div className="flex gap-4 flex-wrap">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Jewelry");
                  }}>
                  Jewelry
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Bags");
                  }}>
                  Bags
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Tops");
                  }}>
                  Tops
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("All");
                  }}>
                  All
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Hoodies");
                  }}>
                  Hoodies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Bottom");
                  }}>
                  Bottom
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("Accessories");
                  }}>
                  Accessories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("More");
                  }}>
                  More
                </a>
              </li>
            </div>
            
            {/* Блок авторизации */}
            <div className="auth-buttons">
              {user ? (
                <div className="user-menu">
                  <Link to="/profile" className="profile-button">
                    {user.username}
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" className="admin-button">
                      Админ-панель
                    </Link>
                  )}
                  <button className="logout-button" onClick={onLogout}>
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="auth-links">
                  <button 
                    className="login-button"
                    onClick={() => handleOpenModal(true)}
                  >
                    Вход
                  </button>
                  <button 
                    className="register-button"
                    onClick={() => handleOpenModal(false)}
                  >
                    Регистрация
                  </button>
                </div>
              )}
            </div>
          </ul>
        </nav>
      </header>

      {/* Хиро-секция */}
      <div
        className="w-full h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-shoe.jpg)" }}></div>

      {/* Гифка с фильтром */}
      <div
        className="w-full"
        style={{
          backgroundImage:
            "url(https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_6634a63bd8a8ec2d7c13861d_6634a650dc267258c0ce6f9f/scale_1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px",
          filter: "grayscale(100%) contrast(1.2)",
        }}></div>

      {/* О нас */}
      <section className="w-full max-w-5xl px-4 py-16 bg-gray-100">
        <h2 className="text-4xl font-bold mb-6 text-left">О нас</h2>

        {/* Контейнер с flexbox для текста */}
        <div className="flex flex-wrap gap-12">
          {/* Левая колонка с текстом */}
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Добро пожаловать в <strong>MØRK STORE</strong>, место, где стиль и
              личность соединяются в идеальной гармонии. Мы создаем одежду,
              которая подходит тем, кто ценит независимость, самовыражение и
              истинную свободу. Мы понимаем, что мода — это не просто тренды,
              это способ выразить себя, выделиться и быть в центре внимания.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Вдохновленные уличной культурой и современными трендами, мы
              стараемся создавать коллекции, которые не только актуальны, но и
              подчеркивают индивидуальность каждого нашего клиента. Каждое
              изделие в нашем магазине создано с вниманием к деталям, начиная от
              выбора ткани и заканчивая дизайном. Наши коллекции рассказывают о
              характере, уверенности и уникальном стиле.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              В <strong>MØRK STORE</strong> мы не просто продаем одежду. Мы
              предлагаем тебе возможность быть частью уникальной истории, где
              стиль не имеет границ, а каждый элемент твоего образа — это
              выражение твоей внутренней силы. Мы гордимся тем, что наша
              продукция производится с уважением к окружающей среде, а также с
              соблюдением высоких этических стандартов.
            </p>
          </div>

          {/* Правая колонка с дополнительным текстом */}
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Мы стремимся быть не просто магазином, а настоящим движением,
              объединяющим людей с похожими ценностями и стремлением к новым
              ощущениям. В нашем магазине каждый найдет что-то, что станет его
              "второй кожей" — будь то стильная куртка, классная футболка или
              аксессуары, которые добавят индивидуальности.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Мы убеждены, что мода должна быть доступной, удобной и в то же
              время вдохновляющей. С нами ты можешь быть уверен, что твой выбор
              всегда будет актуальным, а ты сам — всегда в центре внимания.
              Присоединяйся к <strong>MØRK STORE</strong>, и открой для себя
              новый мир, где стиль встречается с качеством и инновациями.
            </p>
          </div>
        </div>

        {/* Изображение */}
        <div className="mt-8 text-center">
          <img
            src="https://i.gifer.com/origin/ff/ffd0dbcdb2cc7b8218e4a0250bb871f0.gif"
            alt="MØRK STORE Image"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Новинки */}
      <section className="w-full max-w-full px-4 py-12">
        <h2 className="text-center text-4xl font-bold mb-6">New Arrivals</h2>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            className="search-input px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск..."
          />
        </div>

        {/* Индикатор загрузки */}
        {loading && (
          <div className="loading-indicator">
            <p>Загрузка товаров...</p>
          </div>
        )}

        {/* Сообщение об ошибке */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Сетка товаров */}
        {!loading && !error && (
          <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="product-card border p-4 rounded-lg shadow-md hover:shadow-lg transition text-center">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-auto mb-4 rounded cursor-pointer hover:opacity-80 transition"
                    />
                  </Link>
                  <div className="product-info">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products-message">
                <p>Нет товаров, соответствующих вашему запросу.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="w-full bg-black text-white px-8 py-12">
        <div className="footer-container">
          <div className="footer-section">
            <h2>MØRK STORE</h2>
            <p>
              Уличный стиль. Холодный взгляд. Характер в каждой детали. Разные
              бренды мира, люди выбирают нас. Будем рады каждому новым и
              стареньким клиентам.
            </p>
          </div>

          <div className="footer-section">
            <h2>Контакты</h2>
            <p>info@morkstore.com</p>
            <p>+7 (777) 777-77-77</p>
            <p>г.Астана, ул. Стильная, 69</p>
          </div>

          <div className="footer-section">
            <h2>Мы в соцсетях</h2>
            <p>Instagram: @morkstore</p>
            <p>Telegram: @morkstore</p>
            <p>VK: @morkstore</p>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2025 MØRK STORE. Все права защищены.
        </div>
      </footer>
    </div>
  );
}