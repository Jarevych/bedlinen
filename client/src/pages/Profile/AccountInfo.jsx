import React, { useState } from "react";
import axios from "axios";
import "../styles/AccountInfo.css"
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


export default function AccountInfo({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || ""
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setLoading(true);
    // const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`${API_BASE}/api/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Дані оновлено!");
      onUpdate(res.data); // передаємо оновленого користувача наверх
      setEditing(false);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Увійдіть щоб переглянути профіль</p>;

  return (
    <div className="account-info">
      <h3>Мої дані</h3>
      {!editing ? (
        <div className="info-view">
          <p><strong>Ім’я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email || "—"}</p>
          <p><strong>Телефон:</strong> {user.phone || "—"}</p>
          <button className="btn-edit" onClick={() => setEditing(true)}>Редагувати</button>
        </div>
      ) : (
        <form className="info-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ім’я"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Телефон"
          />
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Збереження..." : "Зберегти"}
            </button>
            <button type="button" onClick={() => setEditing(false)}>Скасувати</button>
          </div>
        </form>
      )}
    </div>
  );
}
