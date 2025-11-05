import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";

const API_BASE = "http://localhost:5000";

function FabricDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics/${id}`)
      .then((res) => {
        setFabric(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження тканини:", err);
        setError(true);
        setLoading(false);
      });
    //   console.log(setFabric);
  }, [id]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!fabric) return <div>Тканину не знайдено 😢</div>;

  const handleAddToCart = () => {
    addToCart(fabric);
    alert(`✅ ${fabric.name} додано в кошик!`);
  };

  const handleQuickOrder = () => {
    axios
      .post(`${API_BASE}/api/orders`, {
        productId: fabric._id,
        name: fabric.name,
        price: fabric.pricePerMeter,
      })
      .then(() => alert("🚀 Замовлення відправлено!"))
      .catch((err) => {console.error("Помилка замовлення:", err);
     alert("Помилка при відправці замовлення");
  });
  };

  return (
    <div className="fabric-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="fabric-info">
        <img
          src={`${API_BASE}${fabric.image}`}
          alt={fabric.name}
          className="fabric-details-img"
        />

        <div className="fabric-text">
          <h2>{fabric.name}</h2>
          {fabric.description && <p>{fabric.description}</p>}
          <p>
            <strong>Ціна:</strong> {fabric.pricePerMeter} грн/м
          </p>
          <p>
            <strong>Тканина:</strong> {fabric.fabric}
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            {fabric.inStock ? "В наявності ✅" : "Немає ❌"}
          </p>

          <div className="size-selector">
            <label htmlFor="size">Розмір:</label>
            <select id="size" name="size">
              <option value="1.5">1.5 спальний</option>
              <option value="2">Двоспальний</option>
              <option value="euro">Євро</option>
              <option value="king">King Size</option>
              <option value="custom">Власний розмір</option>
            </select>
          </div>

          <div className="actions">
            <button className="btn-add" onClick={handleAddToCart}>
              🛒 Додати в кошик
            </button>
            <button className="btn-order" onClick={handleQuickOrder}>
              ⚡ Швидке замовлення
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FabricDetails;
