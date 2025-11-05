import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Fabrics from "./Fabrics";
import { CartContext } from "../context/CartContext.jsx";

const API_BASE = "http://localhost:5000";

function Home() {
  const [fabrics, setFabrics] = useState([]);
  const [user, setUser] = useState(null);
  const { cart } = useContext(CartContext); // ✅ беремо з контексту
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics`)
      .then((res) => setFabrics(res.data))
      .catch((err) => console.error("Помилка завантаження", err));
  }, []);

  useEffect(() => {
    if (fabrics.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % fabrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [fabrics]);

  const logout = () => setUser(null);

  if (fabrics.length === 0) {
    return <div className="loading">Завантаження зображень...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="nav">
          <h1>🛏️ Bedlinen</h1>
          <div className="nav-buttons">
            {!user ? (
              <button onClick={() => alert("Тут буде логін")}>Увійти</button>
            ) : (
              <>
                <span>Вітаємо, {user.username}</span>
                <button onClick={logout}>Вийти</button>
              </>
            )}
            <button className="btn-cart" onClick={() => navigate("/cart")}>
              🛒 Кошик ({cart.length})
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="slider">
            {fabrics.map((fabric, idx) => (
              <img
                key={fabric._id}
                src={`${API_BASE}${fabric.image}`}
                alt={fabric.name}
                className={`slide ${currentIndex === idx ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="gallery">
            {fabrics.map((fabric, idx) => (
              <img
                key={fabric._id}
                src={`${API_BASE}${fabric.image}`}
                alt={fabric.name}
                className={`thumbnail ${currentIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* ✅ передаємо addToCart з контексту */}
        <Fabrics
          fabrics={fabrics}
          onSelectFabric={(fabric) => navigate(`/fabric/${fabric._id}`)}
        />
      </main>
    </div>
  );
}

export default Home;
