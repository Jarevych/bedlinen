import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import MyOrders from "./MyOrders.jsx";
import AccountInfo from "./AccountInfo.jsx";

export default function ProfileDashboard() {
  const { user } = useContext(AuthContext);
  console.log(user);
  if (!user) return <p>Будь ласка, увійдіть у систему.</p>;

  return (
    <div className="profile-container">
      <h2>👤 Кабінет користувача</h2>
      <AccountInfo user={user} />
      <MyOrders userId={user.id} />
    </div>
  );
}
// import React from "react";
// import { Link, Outlet } from "react-router-dom";

// export default function ProfileDashboard() {
//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <h2>Мій кабінет</h2>
//         <nav>
//           <Link to="/profile">👤 Мої дані</Link>
//           <Link to="/profile/orders">🧾 Мої замовлення</Link>
//         </nav>
//       </aside>
//       <main className="dashboard-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
