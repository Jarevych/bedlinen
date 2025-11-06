import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './fabricDetails.css'
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";

const API_BASE = "http://localhost:5000";

function FabricDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);

  // поля для замовлення
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    size: "queen",
    customSize: {
    pillowcase: { length: "", width: "" },
    duvet: { length: "", width: "" },
    sheet: { length: "", width: "", withElastic: false, mattressHeight: "" },
  },
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics/${id}`)
      .then((res) => {
        setFabric(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження тканини:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!fabric) return <div>Тканину не знайдено 😢</div>;

  const handleAddToCart = () => {
    addToCart(fabric);
    alert(`✅ ${fabric.name} додано в кошик!`);
  };

  const handleQuickOrder = () => setShowModal(true);
console.log("📦 Дані перед відправкою:", {
  name: orderData.name,
  phone: orderData.phone,
  size: orderData.size,
  fabricId: fabric._id,
  customSize: orderData.size === "custom" ? orderData.customSize : null,
});
  const handleSubmitOrder = async () => {
    try {
      await axios.post(`${API_BASE}/api/orders`, {
        name: orderData.name,
        phone: orderData.phone,
        size: orderData.size,
        fabricId: fabric._id,
        customSize: orderData.size === "custom" ? orderData.customSize : null,
      });
      alert("🚀 Замовлення успішно оформлено!");
      setShowModal(false);
    } catch (err) {
      console.error("Помилка при оформленні замовлення:", err);
      alert("Помилка при оформленні замовлення!");
    }
  };

  const updateCustomSize = (part, field, value) => {
  setOrderData((prev) => {
    const updated = {
      ...prev,
      customSize: {
        ...prev.customSize,
        [part]: {
          ...prev.customSize?.[part],
          [field]: value,
        },
      },
    };
    console.log("🧱 Оновлений customSize:", updated.customSize);
    return updated;
  });
};

  return (
    <div className="fabric-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="fabric-info">
        <img
          src={`${API_BASE}${fabric.image}`}
          alt={fabric.name}
          className="fabric-details-img"
        />

        <div className="fabric-text">
          <h2>{fabric.name}</h2>
          {fabric.description && <p>{fabric.description}</p>}
          <p>
            <strong>Ціна:</strong> {fabric.pricePerMeter} грн/м
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            {fabric.inStock ? "В наявності ✅" : "Немає ❌"}
          </p>

          <div className="size-selector">
            <label htmlFor="size">Розмір:</label>
            <select
              id="size"
              value={orderData.size}
              onChange={(e) =>
                setOrderData({ ...orderData, size: e.target.value })
              }
            >
              <option value="1.5">1.5 спальний</option>
              <option value="2">Двоспальний</option>
              <option value="euro">Євро</option>
              <option value="king">King Size</option>
              <option value="custom">Власний розмір</option>
            </select>
          </div>

          <div className="actions">
            <button className="btn-add" onClick={handleAddToCart}>
              🛒 Додати в кошик
            </button>
            <button className="btn-order" onClick={handleQuickOrder}>
              ⚡ Швидке замовлення
            </button>
          </div>
        </div>
      </div>

      {/* Модалка швидкого замовлення */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚡ Швидке замовлення</h3>
            <p><strong>{fabric.name}</strong></p>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={orderData.name}
              onChange={(e) =>
                setOrderData({ ...orderData, name: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Ваш телефон"
              value={orderData.phone}
              onChange={(e) =>
                setOrderData({ ...orderData, phone: e.target.value })
              }
            />

            {/* Якщо власний розмір */}
            {orderData.size === "custom" && (
              <div className="custom-size-fields">
                <h4>Введіть власні розміри:</h4>

                {["pillowcase", "duvet", "sheet"].map((part) => (
                  <div key={part}>
                    <strong>
                      {part === "pillowcase"
                        ? "Наволочка"
                        : part === "duvet"
                        ? "Підковдра"
                        : "Простирадло"}
                    </strong>
                    <input
                      type="number"
                      placeholder="Довжина (см)"
                      onChange={(e) =>
                        updateCustomSize(part, "length", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Ширина (см)"
                      onChange={(e) =>
                        updateCustomSize(part, "width", e.target.value)
                      }
                    />

                    {part === "sheet" && (
                      <>
                        <label>
                          <input
                            type="checkbox"
                            checked={
                              orderData.customSize?.sheet?.withElastic || false
                            }
                            onChange={(e) =>
                              updateCustomSize("sheet", "withElastic", e.target.checked)
                            }
                          />
                          Простирадло на резинці
                        </label>
                        {orderData.customSize?.sheet?.withElastic && (
                          <input
                            type="number"
                            placeholder="Висота матрацу (см)"
                            onChange={(e) =>
                              updateCustomSize("sheet", "mattressHeight", e.target.value)
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn" onClick={handleSubmitOrder}>
                ✅ Підтвердити
              </button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                ❌ Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FabricDetails;
