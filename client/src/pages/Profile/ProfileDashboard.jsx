import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import AccountInfo from "./AccountInfo.jsx";
import MyOrders from "./MyOrders.jsx";
import "../styles/ProfileDashboard.css";

export default function ProfileDashboard() {
  const { user, token, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "orders"

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) return <p>Увійдіть щоб переглянути профіль</p>;

  return (
    <div className="dashboard-container">
      <h2>👤 Мій профіль</h2>
      
      <div className="tabs">
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          Дані акаунту
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Мої замовлення
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && <AccountInfo user={user} token={token} onUpdate={handleUpdateUser} />}
        {activeTab === "orders" && <MyOrders />}
      </div>
    </div>
  );
}
