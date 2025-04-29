import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminPage.css";
import { getUsers, deleteUser } from "../services/admin";
import { getProducts, deleteProduct, getCategories } from "../services/products";
import ProductForm from "./admin/ProductForm";
import UserForm from "./admin/UserForm";

export default function AdminPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const navigate = useNavigate();

  // Проверяем, имеет ли пользователь права администратора
  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/");
      return;
    }

    // Загружаем данные в зависимости от активной вкладки
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "categories") {
      fetchCategories();
    }
  }, [user, activeTab, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
      console.error("Ошибка при загрузке товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.");
      console.error("Ошибка при загрузке пользователей:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить категории. Пожалуйста, попробуйте позже.");
      console.error("Ошибка при загрузке категорий:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        await deleteProduct(productId);
        // Обновляем список после удаления
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        setError("Не удалось удалить товар. Пожалуйста, попробуйте позже.");
        console.error("Ошибка при удалении товара:", err);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await deleteUser(userId);
        // Обновляем список после удаления
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setError("Не удалось удалить пользователя. Пожалуйста, попробуйте позже.");
        console.error("Ошибка при удалении пользователя:", err);
      }
    }
  };

  const handleAddItem = () => {
    setEditItem(null);
    setShowAddForm(true);
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditItem(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (activeTab === "products") {
        // Обработка формы товара
        // Обновляем список товаров после успешного добавления/редактирования
        await fetchProducts();
      } else if (activeTab === "users") {
        // Обработка формы пользователя
        // Обновляем список пользователей после успешного добавления/редактирования
        await fetchUsers();
      }
      
      setShowAddForm(false);
      setEditItem(null);
      setError(null);
    } catch (err) {
      setError(`Не удалось ${editItem ? 'обновить' : 'добавить'} ${activeTab === "products" ? 'товар' : 'пользователя'}. Пожалуйста, попробуйте позже.`);
      console.error(`Ошибка при ${editItem ? 'обновлении' : 'добавлении'}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Шапка с навигацией */}
      <header className="admin-header">
        <div className="header-container">
          <div className="logo">
            <Link to="/">MØRK STORE</Link>
            <span className="admin-badge">Админ-панель</span>
          </div>
          <div className="user-info">
            <span className="username">Администратор: {user?.username}</span>
            <button onClick={onLogout} className="logout-btn">Выйти</button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-sidebar">
          <h2>Управление</h2>
          <ul className="admin-nav">
            <li 
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              Товары
            </li>
            <li 
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Пользователи
            </li>
            <li 
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              Заказы
            </li>
            <li 
              className={activeTab === "categories" ? "active" : ""}
              onClick={() => setActiveTab("categories")}
            >
              Категории
            </li>
          </ul>
        </div>

        <div className="admin-content">
          {error && <div className="error-message">{error}</div>}
          
          <div className="admin-header-actions">
            <h1>{activeTab === "products" ? "Управление товарами" : 
                activeTab === "users" ? "Управление пользователями" :
                activeTab === "orders" ? "Управление заказами" : "Управление категориями"}</h1>
            
            {(activeTab === "products" || activeTab === "users") && (
              <button className="add-button" onClick={handleAddItem}>
                {activeTab === "products" ? "Добавить товар" : "Добавить пользователя"}
              </button>
            )}
          </div>

          {/* Содержимое в зависимости от выбранной вкладки */}
          {activeTab === "products" && (
            <div className="products-section">
              {loading ? (
                <div className="loading">Загрузка товаров...</div>
              ) : products.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Изображение</th>
                      <th>Название</th>
                      <th>Цена</th>
                      <th>Категория</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="product-thumbnail"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category?.name || "Без категории"}</td>
                        <td className="actions-cell">
                          <button 
                            className="edit-button"
                            onClick={() => handleEditItem(product)}
                          >
                            Редактировать
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-items">Товары не найдены</div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-section">
              {loading ? (
                <div className="loading">Загрузка пользователей...</div>
              ) : users.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Имя пользователя</th>
                      <th>Email</th>
                      <th>Статус</th>
                      <th>Роль</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                            {user.is_active ? "Активен" : "Неактивен"}
                          </span>
                        </td>
                        <td>{user.is_admin ? "Администратор" : "Пользователь"}</td>
                        <td className="actions-cell">
                          <button 
                            className="edit-button"
                            onClick={() => handleEditItem(user)}
                          >
                            Редактировать
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-items">Пользователи не найдены</div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <p>Раздел управления заказами находится в разработке.</p>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="categories-section">
              {loading ? (
                <div className="loading">Загрузка категорий...</div>
              ) : categories.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Количество товаров</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.products?.length || 0}</td>
                        <td className="actions-cell">
                          <button 
                            className="edit-button"
                            onClick={() => handleEditItem(category)}
                          >
                            Редактировать
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => window.alert("Функция удаления категорий находится в разработке")}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-items">Категории не найдены</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна для добавления/редактирования */}
      {showAddForm && activeTab === "products" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm 
              product={editItem} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {showAddForm && activeTab === "users" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm 
              user={editItem} 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}