import React, { useState } from "react";
import FabricsList from "./FabricsList.jsx";
import OrdersList from "./OrderList.jsx";
import AddFabric from "./AddFabric.jsx";
import UsersList from "./UsersList.jsx";
import '../styles/AdminDashboard.css'
import '../styles/admin-table.css'


export default function AdminDashboard() {
  const [tab, setTab] = useState("fabrics");

  return (
    <div className="admin-dashboard">
      <h2>🛠️ Панель адміністратора</h2>
      <nav className="admin-nav">
        <button 
         className={tab === "fabrics" ? "active" : ""}
         onClick={() => setTab("fabrics")}>Постілі</button>
        <button 
         className={tab === "orders" ? "active" : ""}
        onClick={() => setTab("orders")}>Замовлення</button>
        <button 
         className={tab === "add" ? "active" : ""}
        onClick={() => setTab("add")}>Додати постіль</button>
        <button 
        className={tab === "users" ? "active" : ""}
        onClick={() => setTab("users")}>Користувачі</button>
      </nav>

      <div className="admin-content">
        {tab === "fabrics" && <FabricsList />}
        {tab === "orders" && <OrdersList />}
        {tab === "add" && <AddFabric />}
        {tab === "users" && <UsersList />}
      </div>
    </div>
  );
}

