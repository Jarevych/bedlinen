import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../styles/AccountInfo.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AccountInfo() {
  const { user, updateUser } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 🔑 СИНХРОНІЗАЦІЯ з AuthContext
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_BASE}/api/users/me`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        updateUser(res.data); // 🔥 ОФІЦІЙНО оновлюємо контекст
        setEditing(false);
        setMessage({ type: "success", text: "Дані оновлено" });
      } else {
        throw new Error(res.data?.message);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Сталася помилка" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Увійдіть щоб переглянути профіль</p>;

  return (
    <div className="account-info">
      <h3>Мої дані</h3>

      {message && (
        <p className={message.type === "error" ? "error" : "success"}>
          {message.text}
        </p>
      )}

      {!editing ? (
        <div className="info-view">
          <p><strong>Ім’я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email || "—"}</p>
          <p><strong>Телефон:</strong> {user.phone || "—"}</p>
          <button className="btn-edit" onClick={() => setEditing(true)}>
            Редагувати
          </button>
        </div>
      ) : (
        <form className="info-form" onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} required />
          <input name="email" value={formData.email} onChange={handleChange} />
          <input name="phone" value={formData.phone} onChange={handleChange} />

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Збереження..." : "Зберегти"}
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              Скасувати
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
