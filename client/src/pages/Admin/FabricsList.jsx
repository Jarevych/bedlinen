import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin-table.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const token = localStorage.getItem("token");
export default function FabricsList() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics`)
      .then((res) => {
        setFabrics(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Помилка при отриманні тканин:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Точно видалити цю тканину?")) return;
    try {
      await axios.delete(`${API_BASE}/api/fabrics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFabrics((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Помилка при видаленні:", err);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="fabrics-list">
      <h3>🧵 Всі тканини</h3>
      {fabrics.length === 0 ? (
        <p>Поки що немає тканин.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Тип</th>
              <th>Наявність</th>
              <th>Основне фото</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {fabrics.map((fabric) => (
              <tr key={fabric._id}>
                <td>{fabric.name}</td>
                <td>{fabric.pricePerMeter} грн</td>
                <td>{fabric.fabric}</td>
                <td>{fabric.inStock ? "✅" : "❌"}</td>
                <td>
                  {fabric.image && (
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      width="100"
                    />
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/edit/${fabric._id}`)}
                    className="btn-small"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(fabric._id)}
                    className="btn-small red"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
