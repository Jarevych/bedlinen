import React, { useState } from "react";
import FabricsList from "./FabricsList.jsx";
import OrdersList from "./OrderList.jsx";
import AddFabric from "./AddFabric.jsx";
import UsersList from "./UsersList.jsx";

export default function AdminDashboard() {
  const [tab, setTab] = useState("fabrics");

  return (
    <div className="admin-dashboard">
      <h2>🛠️ Панель адміністратора</h2>
      <nav className="admin-nav">
        <button onClick={() => setTab("fabrics")}>Постілі</button>
        <button onClick={() => setTab("orders")}>Замовлення</button>
        <button onClick={() => setTab("add")}>Додати постіль</button>
        <button onClick={() => setTab("users")}>Користувачі</button>
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
// import React from "react";
// import { Link, Outlet } from "react-router-dom";

// export default function AdminDashboard() {
//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <h2>Адмін-панель</h2>
//         <nav>
//           <Link to="/admin">📦 Усі товари</Link>
//           <Link to="/admin/add-fabric">➕ Додати постіль</Link>
//           <Link to="/admin/orders">🧾 Замовлення</Link>
//           <Link to="/admin/users">👤 Користувачі</Link>
//         </nav>
//       </aside>
//       <main className="dashboard-content">
//         <Outlet /> {/* сюди підвантажуються вкладки */}
//       </main>
//     </div>
//   );
// }

