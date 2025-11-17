import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import axios from "axios";
import "../pages/styles/FabricDetails.css";

const API_BASE = "http://localhost:5000";

const SIZE_TABLES = {
  1.5: [
    { name: "Наволочка", count: 1, size: "50×70 см" },
    { name: "Підковдра", count: 1, size: "160×200 см" },
    { name: "Простирадло", count: 1, size: "200×220 см" },
  ],
  2: [
    { name: "Наволочка", count: 2, size: "50×70 см" },
    { name: "Підковдра", count: 1, size: "180×210 см" },
    { name: "Простирадло", count: 1, size: "220×240 см" },
  ],
  euro: [
    { name: "Наволочка", count: 2, size: "50×70 см" },
    { name: "Підковдра", count: 1, size: "200×220 см" },
    { name: "Простирадло", count: 1, size: "240×260 см" },
  ],
  king: [
    { name: "Наволочка", count: 2, size: "50×70 см" },
    { name: "Підковдра", count: 1, size: "220×240 см" },
    { name: "Простирадло", count: 1, size: "260×280 см" },
  ],
};

export default function FabricDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [fabric, setFabric] = useState(null);
  const [size, setSize] = useState("1.5");
  const [comment, setComment] = useState("");

  const [customSize, setCustomSize] = useState({
    pillowcase: { length: "", width: "" },
    duvet: { length: "", width: "" },
    sheet: {
      length: "",
      width: "",
      withElastic: false,
      mattressHeight: "",
    },
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics/${id}`)
      .then((res) => setFabric(res.data))
      .catch((err) => console.error("Помилка завантаження тканини:", err));
  }, [id]);

  if (!fabric) return <p>Завантаження...</p>;

  const updateCustom = (part, field, value) => {
    setCustomSize((prev) => ({
      ...prev,
      [part]: {
        ...prev[part],
        [field]: value,
      },
    }));
  };

  const handleAdd = () => {
    const item = {
      ...fabric,
      size,
      customSize: size === "custom" ? customSize : null,
      comment,
    };

    addToCart(item);
    alert("Додано до кошика!");
  };

  return (
    <div className="fabric-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <h2>{fabric.name}</h2>
      <p>{fabric.description}</p>

      {fabric.image && (
        <img
          src={`${API_BASE}${fabric.image}`}
          alt={fabric.name}
          className="fabric-main-image"
        />
      )}

      <p>
        <strong>Ціна:</strong> {fabric.pricePerMeter} грн/м
      </p>

      {/* Вибір розміру */}
      <label>Розмір набору:</label>
      <select value={size} onChange={(e) => setSize(e.target.value)}>
        <option value="1.5">1.5 спальний</option>
        <option value="2">Двоспальний</option>
        <option value="euro">Євро</option>
        <option value="king">King Size</option>
        <option value="custom">Власний розмір</option>
      </select>

      {/* Таблиця стандартних розмірів */}
      {size !== "custom" && (
        <table className="size-table">
          <thead>
            <tr>
              <th>Елемент</th>
              <th>Кількість</th>
              <th>Розмір</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLES[size].map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>{item.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Кастомні розміри */}
      {size === "custom" && (
        <div className="custom-inputs">
          <h3>Кастомні розміри</h3>

          <h4>Наволочка</h4>
          <input
            type="number"
            placeholder="Довжина"
            value={customSize.pillowcase.length}
            onChange={(e) =>
              updateCustom("pillowcase", "length", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Ширина"
            value={customSize.pillowcase.width}
            onChange={(e) =>
              updateCustom("pillowcase", "width", e.target.value)
            }
          />

          <h4>Підковдра</h4>
          <input
            type="number"
            placeholder="Довжина"
            value={customSize.duvet.length}
            onChange={(e) => updateCustom("duvet", "length", e.target.value)}
          />
          <input
            type="number"
            placeholder="Ширина"
            value={customSize.duvet.width}
            onChange={(e) => updateCustom("duvet", "width", e.target.value)}
          />

          <h4>Простирадло</h4>
          <input
            type="number"
            placeholder="Довжина"
            value={customSize.sheet.length}
            onChange={(e) => updateCustom("sheet", "length", e.target.value)}
          />
          <input
            type="number"
            placeholder="Ширина"
            value={customSize.sheet.width}
            onChange={(e) => updateCustom("sheet", "width", e.target.value)}
          />

          <label className="elastic-check">
            <input
              type="checkbox"
              checked={customSize.sheet.withElastic}
              onChange={(e) =>
                updateCustom("sheet", "withElastic", e.target.checked)
              }
            />
            Простирадло на резинці
          </label>

          {customSize.sheet.withElastic && (
            <input
              type="number"
              placeholder="Висота матрацу"
              value={customSize.sheet.mattressHeight}
              onChange={(e) =>
                updateCustom("sheet", "mattressHeight", e.target.value)
              }
            />
          )}
        </div>
      )}

      {/* Коментар */}
      <textarea
        placeholder="Коментар до набору..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button className="btn-add" onClick={handleAdd}>
        Додати в кошик
      </button>
    </div>
  );
}
