import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Паролі не співпадають");
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_BASE}/api/auth/reset-password/${token}`,
        { password }
      );

      alert("✅ Пароль змінено. Увійдіть з новим паролем");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Помилка при зміні пароля"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>🔒 Новий пароль</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Новий пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Повторіть пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Зберігаємо..." : "Змінити пароль"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
