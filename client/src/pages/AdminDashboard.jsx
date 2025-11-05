import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="admin-dashboard">
      <h2>👑 Панель адміністратора</h2>
      <p>Вітаємо, {user?.name}</p>

      <nav className="admin-nav">
        <Link to="/admin/fabrics">🧵 Постелі</Link>
        <Link to="/admin/orders">📦 Замовлення</Link>
        <Link to="/admin/users">👥 Користувачі</Link>
        <Link to="/admin/add-fabric">➕ Додати постіль</Link>
      </nav>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
