import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import AccountInfo from "./AccountInfo.jsx";
import MyOrders from "./MyOrders.jsx";
import "../styles/ProfileDashboard.css";
import ChangePassword from "./ChangePassword.jsx";

export default function ProfileDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "orders"

  if (!user) return <p>Увійдіть щоб переглянути профіль</p>;

  return (
    <div className="dashboard-container">
      <h2>👤 Мій профіль</h2>

      <div className="tabs">
        <button
          className={activeTab === "info" && <AccountInfo />}
          onClick={() => setActiveTab("info")}
        >
          Дані акаунту
        </button>
        <button
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          🔒 Пароль
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Мої замовлення
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && <AccountInfo user={user} />}
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "orders" && <MyOrders />}
      </div>
    </div>
  );
}
