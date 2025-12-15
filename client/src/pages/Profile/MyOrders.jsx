// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// // export default function MyOrders({ userId }) {
// //   const [orders, setOrders] = useState([]);

// //   useEffect(() => {
// //     axios
// //       .get(`${API_BASE}/api/orders/user/${userId}`)
// //       .then((res) => setOrders(res.data))
// //       .catch((err) => console.error("Помилка завантаження замовлень:", err));
// //   }, [userId]);

// //   return (
// //     <div className="orders-list">
// //       <h3>Мої замовлення</h3>
// //       {orders.length === 0 ? (
// //         <p>Поки що немає замовлень</p>
// //       ) : (
// //         <ul>
// //           {orders.map((order) => (
// //             <li key={order._id}>
// //               <strong>№ {order._id}</strong> — {order.status}
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }


// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// // export default function MyOrders() {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");

// //     axios
// //       .get(`${API_BASE}/api/orders/my`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       })
// //       .then((res) => setOrders(res.data))
// //       .catch((err) => console.error("Error loading orders:", err))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   if (loading) return <p>Завантаження...</p>;

// //   if (orders.length === 0) {
// //     return <p>У вас поки що немає замовлень.</p>;
// //   }

// //   return (
// //     <div className="orders-list">
// //       <h3>🧾 Мої замовлення</h3>

// //       {orders.map((order) => (
// //         <div key={order._id} className="order-card">
// //           <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
// //           <p><strong>Статус:</strong> {order.status}</p>
// //           <p><strong>Розмір:</strong> {order.size}</p>

// //           {order.fabric && (
// //             <p>
// //               <strong>Тканина:</strong> {order.fabric.name}
// //             </p>
// //           )}

// //           {order.comment && (
// //             <p><strong>Коментар:</strong> {order.comment}</p>
// //           )}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function MyOrders() {
//   const { user } = useContext(AuthContext);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     axios.get(`${API_BASE}/api/orders/my`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     })
//     .then(res => {
//   console.log("Orders from API:", res.data);
//   setOrders(res.data);
// })
//     .catch(err => console.error(err));
//   }, [user]);
// console.log("MyOrders:", orders);
//   if (!user) return <p>Увійдіть щоб переглянути замовлення</p>;

//   return (
//     <div>
//       <h3>🧾 Мої замовлення</h3>

//       {orders.length === 0 && <p>У вас ще немає замовлень.</p>}

//       <div className="orders-list">
//         {orders.map(o => (
//           <div key={o._id} className="order-card">
//             <img src={o.fabric?.image} alt="" height="80" />
//             <div>
//               <p><b>Тканина:</b> {o.fabric?.name}</p>
//               <p><b>Розмір:</b> {o.size}</p>
//               <p><b>Статус:</b> {o.status}</p>
//               <p><b>Дата:</b> {new Date(o.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../styles/MyOrders.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function MyOrders() {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) setOrders(res.data);
        else setOrders([]);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити замовлення");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  const openLightbox = (img) => {
    setLightboxImg(img.startsWith("http") ? img : `${API_BASE}${img}`);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  if (!user) return <p>Увійдіть щоб переглянути замовлення</p>;
  if (loading) return <p>Завантаження замовлень...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>🧾 Мої замовлення</h3>

      {orders.length === 0 ? (
        <p>У вас ще немає замовлень.</p>
      ) : (
        <div className="my-orders-list">
          {orders.map((o) => (
            <div key={o._id} className="my-order-card">
              {o.fabric?.image && (
                <img
                  src={o.fabric.image.startsWith("http") ? o.fabric.image : `${API_BASE}${o.fabric.image}`}
                  alt={o.fabric.name || ""}
                  onClick={() => openLightbox(o.fabric.image)}
                />
              )}
              <div>
                <p><b>Тканина:</b> {o.fabric?.name || "—"}</p>
                <p><b>Розмір:</b> {o.size || "—"}</p>
                <p><b>Статус:</b> {o.status || "—"}</p>
                <p><b>Дата:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img src={lightboxImg} alt="zoomed" />
        </div>
      )}
    </div>
  );
}
