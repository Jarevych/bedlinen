import React, { useState } from "react";
import axios from "axios";
import "./OrderPopup.css";

const API_BASE = "http://localhost:5000";

function OrderPopup({ fabric, onClose, onAddToCart }) {
  const [form, setForm] = useState({ name: "", phone: "", size: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!fabric) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuickOrder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/orders`, {
        ...form,
        fabricId: fabric._id,
      });
      setMessage(res.data.message);
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Помилка при оформленні замовлення");
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Замовлення: {fabric.name}</h2>
        <img src={`${API_BASE}${fabric.image}`} alt={fabric.name} />
        <form>
          <input
            type="text"
            name="name"
            placeholder="Ваше ім'я"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            required
          >
            <option value="">Оберіть розмір</option>
            <option value="single">Односпальний</option>
            <option value="double">Двоспальний</option>
            <option value="queen">Queen</option>
            <option value="king">King</option>
          </select>

          <div className="buttons">
            <button
              type="button"
              className="btn-cart"
              onClick={() => onAddToCart({ ...fabric, size: form.size })}
            >
              🛒 Додати в кошик
            </button>

            <button
              type="button"
              className="btn-submit"
              onClick={handleQuickOrder}
              disabled={loading}
            >
              ⚡ {loading ? "Надсилання..." : "Швидке замовлення"}
            </button>
          </div>

          {message && <p className="status-msg">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default OrderPopup;
