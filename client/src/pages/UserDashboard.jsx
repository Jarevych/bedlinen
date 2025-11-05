import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:5000/api/orders/user/${user._id}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Помилка отримання замовлень:", err));
  }, []);

  if (!user) return <p>Будь ласка, увійдіть у свій акаунт.</p>;

  return (
    <div className="user-dashboard">
      <h2>👤 Вітаємо, {user.name}!</h2>
      <p>Ваша роль: {user.role}</p>
      <h3>Ваші замовлення:</h3>
      {orders.length === 0 ? (
        <p>У вас поки немає замовлень.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o._id}>
              Замовлення #{o._id} — {o.totalPrice} грн — {o.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
