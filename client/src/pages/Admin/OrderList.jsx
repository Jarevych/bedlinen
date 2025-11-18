import React, { useEffect, useState } from "react";
import "../styles/OrdersList.css";
import axios from "axios";
import "../styles/admin-table.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/orders`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) =>
        console.error("❌ Помилка при отриманні замовлень:", err)
      );
  }, []);
  console.log(orders);
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("❌ Помилка зміни статусу:", err);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) return <p>Завантаження...</p>;
  console.log(orders);

  return (
    <div className="orders-list">
      <h3>📦 Всі замовлення</h3>

      {/* 🔹 Панель фільтра */}
      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Усі
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Очікує
        </button>
        <button
          className={filter === "processing" ? "active" : ""}
          onClick={() => setFilter("processing")}
        >
          В обробці
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Завершено
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Немає замовлень.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Користувач</th>
              <th>Телефон</th>
              <th>Розмір</th>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.size}</td>
                <td>
                  {order.fabric ? <strong>{order.fabric.name}</strong> : "—"}
                </td>
                <td>
                  <strong>{order.fabric?.pricePerMeter || "-"}</strong> грн/м
                </td>
                <td className={`status-${order.status}`}>{order.status}</td>
                <td>
                  <td>
                    {order.size === "custom" && order.customSize ? (
                      <div className="custom-size-info">
                        <p>
                          <strong>Наволочка:</strong>{" "}
                          {order.customSize.pillowcase?.length || "-"}×
                          {order.customSize.pillowcase?.width || "-"} см
                        </p>
                        <p>
                          <strong>Підковдра:</strong>{" "}
                          {order.customSize.duvet?.length || "-"}×
                          {order.customSize.duvet?.width || "-"} см
                        </p>
                        <p>
                          <strong>Простирадло:</strong>{" "}
                          {order.customSize.sheet?.length || "-"}×
                          {order.customSize.sheet?.width || "-"} см
                          {order.customSize.sheet?.withElastic  && (
                            <>
                              {" "}
                              (на резинці
                              {order.customSize.sheet?.mattressHeight && (
                                <>
                                  {" "}
                                  — висота {order.customSize.sheet.mattressHeight} см
                                </>
                              )}
                              )
                            </>
                          )}
                        </p>
                      </div>
                    ) : (
                      order.size
                    )}
                  </td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
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
