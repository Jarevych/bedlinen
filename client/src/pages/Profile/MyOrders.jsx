import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function MyOrders({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/orders/user/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Помилка завантаження замовлень:", err));
  }, [userId]);

  return (
    <div className="orders-list">
      <h3>Мої замовлення</h3>
      {orders.length === 0 ? (
        <p>Поки що немає замовлень</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <strong>№ {order._id}</strong> — {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
