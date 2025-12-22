import React, { useState } from "react";
import axios from "axios";
import "../styles/AccountInfo.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return alert("Паролі не співпадають");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE}/api/users/me/password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Пароль змінено");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "❌ Помилка зміни пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-info">
      <h3>🔒 Зміна пароля</h3>

      <form className="info-form" onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Старий пароль"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Новий пароль"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердити новий пароль"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Зміна..." : "Змінити пароль"}
        </button>
      </form>
    </div>
  );
}
