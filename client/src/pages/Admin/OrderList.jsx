import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/orders`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Помилка при отриманні замовлень:", err));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Помилка зміни статусу:", err);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="orders-list">
      <h3>📦 Всі замовлення</h3>
      {orders.length === 0 ? (
        <p>Немає замовлень.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Користувач</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.email || "—"}</td>
                <td>{order.totalPrice} грн</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Очікує</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Завершено</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
