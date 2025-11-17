import React from "react";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
import "../pages/styles/Fabrics.css";

function Fabrics({ fabrics, onSelectFabric }) {
  if (!fabrics || fabrics.length === 0)
    return <p>Поки що немає доступних тканин.</p>;

  return (
    <section className="fabrics">
      <h2>Наші тканини</h2>
      <div className="fabrics-grid">
        {fabrics.map((fabric) => (
          <div
            className="fabric-card"
            key={fabric._id}
          >
            <img
              src={`${API_BASE}${fabric.image}`}
              alt={fabric.name}
              className="fabric-img"
            />
            <h3>{fabric.name}</h3>
            {fabric.description && <p>{fabric.description}</p>}
            <p>від {fabric.pricePerMeter} грн</p>
            <p>Тканина: {fabric.fabric}</p>
            <p>{fabric.inStock ? "В наявності ✅" : "Немає ❌"}</p>
            <button
              className="details-btn"
              onClick={() => onSelectFabric(fabric)}
            >
              Деталі
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Fabrics;
