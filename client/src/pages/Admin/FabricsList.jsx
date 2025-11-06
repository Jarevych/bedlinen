import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/admin-table.css'


const API_BASE = "http://localhost:5000";

export default function FabricsList() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics`)
      .then((res) => {
        setFabrics(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Помилка при отриманні постелей:", err));
  }, []);
console.log(fabrics)
  const handleDelete = async (id) => {
    if (!window.confirm("Точно видалити цю постіль?")) return;
    try {
      await axios.delete(`${API_BASE}/api/fabrics/${id}`);
      setFabrics((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Помилка при видаленні:", err);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="fabrics-list">
      <h3>🧵 Всі постелі</h3>
      {fabrics.length === 0 ? (
        <p>Поки що немає постелей.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Тип</th>
              <th>Наявність</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {fabrics.map((fabric) => (
              <tr key={fabric._id}>
                <td>{fabric.name}</td>
                <td>{fabric.pricePerMeter} грн</td>
                <td>{fabric.type}</td>
                <td>{fabric.inStock ? "✅" : "❌"}</td>
                <td><img src={`${API_BASE}${fabric.image}`} alt={fabric.name} width="100" /></td>
                <td>
                  <button onClick={() => alert("Редагування скоро!")} className="btn-small">✏️</button>
                  <button onClick={() => handleDelete(fabric._id)} className="btn-small red">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
