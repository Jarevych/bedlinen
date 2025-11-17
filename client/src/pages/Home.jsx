import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Fabrics from "./Fabrics";
import { CartContext } from "../context/CartContext.jsx";
import "../pages/styles/Home.css";

const API_BASE = "http://localhost:5000";

function Home() {
  const [fabrics, setFabrics] = useState([]);
  // const { cart } = useContext(CartContext);
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
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [fabrics]);

  if (fabrics.length === 0) {
    return <div className="loading">Завантаження зображень...</div>;
  }

  // Обмеження кількості видимих мініатюр
  const getVisibleThumbnails = () => {
    const isMobile = window.innerWidth < 768;
    const visibleCount = isMobile ? 3 : 7; // на десктопі більше
    const half = Math.floor(visibleCount / 2);
    const start = (currentIndex - half + fabrics.length) % fabrics.length;

    return Array.from({ length: visibleCount }, (_, i) => (start + i) % fabrics.length);
  };

  const visibleIndices = getVisibleThumbnails();

  return (
    <div className="home-page">
      <section className="hero">
        {/* 🔹 Слайдер */}
        <div className="slider">
          {fabrics.map((fabric, idx) => (
            <img
              key={fabric._id}
              src={`${API_BASE}${fabric.image}`}
              alt={fabric.name}
              className={`slide ${currentIndex === idx ? "active" : ""}`}
            />
          ))}
          <button
            className="nav prev"
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + fabrics.length) % fabrics.length)
            }
          >
            ❮
          </button>
          <button
            className="nav next"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % fabrics.length)
            }
          >
            ❯
          </button>
        </div>

        {/* 🔹 Галерея мініатюр */}
        <div className="gallery">
          {visibleIndices.map((idx) => (
            <img
              key={fabrics[idx]._id}
              src={`${API_BASE}${fabrics[idx].image}`}
              alt={fabrics[idx].name}
              className={`thumbnail ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </section>

      <section className="fabrics-list">
        <Fabrics
          fabrics={fabrics}
          onSelectFabric={(fabric) => navigate(`/fabric/${fabric._id}`)}
        />
      </section>
    </div>
  );
}

export default Home;
