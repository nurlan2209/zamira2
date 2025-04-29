import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CatalogPage from "./components/CatalogPage";
import ProductPage from "./components/ProductPage";
import PaymentPage from "./components/PaymentPage";
import CheckoutPage from "./components/CheckoutPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import Modal from "./components/Modal";
import { isAuthenticated, getCurrentUser, logout } from "./services/auth";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получаем данные пользователя при загрузке приложения
  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          logout(); // Если токен невалидный, выходим из системы
        }
      }
      setLoading(false);
    };

    fetchUser();

    // Обработчик события для открытия модального окна
    const handleOpenModal = (event) => {
      const { isLogin } = event.detail;
      setIsLogin(isLogin);
      setShowModal(true);
    };

    document.addEventListener("openModal", handleOpenModal);

    return () => {
      document.removeEventListener("openModal", handleOpenModal);
    };
  }, []);

  const openModal = (isLoginForm) => {
    setIsLogin(isLoginForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/"; // Перенаправляем на главную страницу
  };

  // Если данные пользователя еще загружаются, можно показать спиннер или заглушку
  if (loading) {
    return <div className="loading-overlay">Загрузка...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              openModal={openModal} 
              user={user} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/catalog" 
          element={
            <CatalogPage 
              user={user} 
              openModal={openModal} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductPage 
              user={user} 
              openModal={openModal} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PaymentPage 
              user={user} 
              openModal={openModal} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <CheckoutPage 
              user={user} 
              openModal={openModal} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfilePage 
              user={user} 
              openModal={openModal} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              user={user} 
              onLogout={handleLogout} 
            />
          } 
        />
      </Routes>

      {/* Модальное окно для регистрации/входа */}
      <Modal
        show={showModal}
        closeModal={closeModal}
        isLogin={isLogin}
      />
    </Router>
  );
}

export default App;