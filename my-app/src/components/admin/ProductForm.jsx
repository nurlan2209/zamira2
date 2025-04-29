import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/products";
import "../../styles/AdminForms.css";

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    category_id: "",
    category_name: "", // Новое поле для ввода названия категории
    sizes: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([
    "XS", "S", "M", "L", "XL", "XXL", "XXXL", 
    "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"
  ]);
  const [useExistingCategory, setUseExistingCategory] = useState(true);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchCategories();
    
    // Если редактируем существующий товар, заполняем форму его данными
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description || "",
        image_url: product.image_url,
        category_id: product.category_id,
        category_name: product.category?.name || "",
        sizes: product.sizes ? product.sizes.map(size => size.size) : []
      });
    }
  }, [product]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Особая обработка для поля цены (разрешаем только числа)
    if (name === "price") {
      // Разрешаем только числа и точку для десятичной части
      const isValid = /^\d*\.?\d*$/.test(value);
      if (!isValid && value !== "") {
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeToggle = (size) => {
    // Если размер уже выбран, удаляем его, иначе добавляем
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size]
      });
    }
  };

  const toggleCategoryInputMode = () => {
    setUseExistingCategory(!useExistingCategory);
    // Сбрасываем значения связанных полей
    setFormData({
      ...formData,
      category_id: "",
      category_name: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!formData.name || !formData.price || !formData.image_url) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    // Проверяем, что выбран хотя бы один размер
    if (formData.sizes.length === 0) {
      setError("Пожалуйста, выберите хотя бы один размер");
      return;
    }
    
    // Проверяем, что указана категория (либо выбрана из списка, либо введена вручную)
    if (useExistingCategory && !formData.category_id) {
      setError("Пожалуйста, выберите категорию");
      return;
    }
    
    if (!useExistingCategory && !formData.category_name) {
      setError("Пожалуйста, введите название категории");
      return;
    }
    
    // Преобразуем цену в число перед отправкой
    const processedData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    // Если введена новая категория, добавляем специальное поле new_category
    if (!useExistingCategory) {
      processedData.new_category = formData.category_name;
      delete processedData.category_id; // Удаляем ID категории, так как создаем новую
    } else {
      delete processedData.new_category;
      delete processedData.category_name;
    }
    
    onSubmit(processedData);
  };

  if (loading && !product) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-form product-form">
      <h2>{product ? "Редактирование товара" : "Добавление товара"}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название товара *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Цена *</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image_url">URL изображения *</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            required
          />
          {formData.image_url && (
            <div className="image-preview">
              <img src={formData.image_url} alt="Предпросмотр" />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <div className="category-toggle">
            <label>
              <input
                type="checkbox"
                checked={useExistingCategory}
                onChange={toggleCategoryInputMode}
              />
              Использовать существующую категорию
            </label>
          </div>
          
          {useExistingCategory ? (
            <>
              <label htmlFor="category_id">Выберите категорию *</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required={useExistingCategory}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label htmlFor="category_name">Название новой категории *</label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                placeholder="Введите название новой категории"
                required={!useExistingCategory}
              />
            </>
          )}
        </div>
        
        <div className="form-group">
          <label>Доступные размеры *</label>
          <div className="sizes-container">
            {availableSizes.map((size) => (
              <button
                type="button"
                key={size}
                className={`size-btn ${formData.sizes.includes(size) ? 'selected' : ''}`}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить товар"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;