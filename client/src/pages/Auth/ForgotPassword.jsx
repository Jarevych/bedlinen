import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Помилка при відправці запиту"
      );
    } finally {
      setLoading(false);
    }
  };
console.log("API_BASE =", API_BASE);

  return (
    <div className="auth-form">
      <h2>🔑 Забули пароль?</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Надсилаємо..." : "Надіслати посилання"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
