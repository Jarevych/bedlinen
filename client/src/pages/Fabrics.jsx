import React, { useState } from "react";
import OrderPopup from "../components/OrderPopup";

const API_BASE = "http://localhost:5000";

function Fabrics({ fabrics, onAddToCart }) {
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  if (!fabrics || fabrics.length === 0)
    return <p>Поки що немає доступних тканин.</p>;

  return (
    <section className="fabrics">
      <h2>Наші тканини</h2>
      <div className="fabrics-grid">
        {fabrics.map((fabric) => (
          <div className="fabric-card" key={fabric._id}>
            <img
              src={`${API_BASE}${fabric.image}`}
              alt={fabric.name}
              className="fabric-img"
            />
            <h3>{fabric.name}</h3>
            {fabric.description && <p>{fabric.description}</p>}
            <p>від&nbsp;{fabric.pricePerMeter}&nbsp;грн</p>
            <p>Тканина - {fabric.fabric}</p>
           <p>
  {fabric.inStock ? 'В наявності' : 'Немає в наявності'}
</p>

            <div className="actions">
              <button
              className="btn-add"
                onClick={() => {
                  setSelectedFabric(fabric);
                  setShowPopup(true);
                }}
              >
                Замовити
              </button>
  
              <button onClick={() => onAddToCart(fabric)} className="btn-add">
                🛒 Додати в кошик
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <OrderPopup
          fabric={selectedFabric}
          onClose={() => setShowPopup(false)}
          onAddToCart={(item) => {
            onAddToCart(item);
            setShowPopup(false);
          }}
        />
      )}
    </section>
  );
}

export default Fabrics;
