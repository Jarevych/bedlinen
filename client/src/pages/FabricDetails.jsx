import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import "../pages/styles/FabricDetails.css";

const API_BASE = "http://localhost:5000";

const SIZE_TABLES = {
  "1.5": [
    { name: "Наволочка", count: 1, size: "50×70" },
    { name: "Підковдра", count: 1, size: "160×200" },
    { name: "Простирадло", count: 1, size: "200×220" },
  ],
  "2": [
    { name: "Наволочка", count: 2, size: "50×70" },
    { name: "Підковдра", count: 1, size: "180×210" },
    { name: "Простирадло", count: 1, size: "220×240" },
  ],
  euro: [
    { name: "Наволочка", count: 2, size: "50×70" },
    { name: "Підковдра", count: 1, size: "200×220" },
    { name: "Простирадло", count: 1, size: "240×260" },
  ],
  king: [
    { name: "Наволочка", count: 2, size: "50×70" },
    { name: "Підковдра", count: 1, size: "220×240" },
    { name: "Простирадло", count: 1, size: "260×280" },
  ],
};

export default function FabricDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);

  // gallery / lightbox
  const [mainImage, setMainImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // order state (used both for Add to Cart and Quick Order modal)
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    size: "1.5",
    comment: "",
    customSize: {
      pillowcase: { length: "", width: "" },
      duvet: { length: "", width: "" },
      sheet: { length: "", width: "", withElastic: false, mattressHeight: "" },
    },
    // for standard set: separate flag inside customSize.sheet.withElastic is reused
  });

  const [showQuickModal, setShowQuickModal] = useState(false);
  const [submittingQuick, setSubmittingQuick] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/api/fabrics/${id}`)
      .then((res) => {
        if (cancelled) return;
        setFabric(res.data);
        setMainImage(res.data.image || (res.data.additionalImages?.[0] ?? null));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження тканини:", err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!fabric) return <div>Тканину не знайдено 😢</div>;

  // utils
  const updateOrder = (patch) =>
    setOrderData((prev) => ({ ...prev, ...patch }));

  const updateCustom = (part, field, value) => {
    setOrderData((prev) => ({
      ...prev,
      customSize: {
        ...prev.customSize,
        [part]: { ...prev.customSize[part], [field]: value },
      },
    }));
  };

  // parse table size like "200×220" -> [200,220] (numbers)
  const parseSize = (s) => {
    if (!s) return [null, null];
    const parts = s.split("×").map((p) => Number(p.trim()));
    return parts.length === 2 ? parts : [null, null];
  };

  // Add to cart: include all selected options (size, customSize, comment)
  const handleAddToCart = () => {
    const cartItem = {
      ...fabric,
      _id: fabric._id,
      size: orderData.size,
      comment: orderData.comment || "",
      customSize:
        orderData.size === "custom"
          ? {
              pillowcase: {
                length: orderData.customSize.pillowcase.length || null,
                width: orderData.customSize.pillowcase.width || null,
              },
              duvet: {
                length: orderData.customSize.duvet.length || null,
                width: orderData.customSize.duvet.width || null,
              },
              sheet: {
                length: orderData.customSize.sheet.length || null,
                width: orderData.customSize.sheet.width || null,
                withElastic: !!orderData.customSize.sheet.withElastic,
                mattressHeight:
                  orderData.customSize.sheet.withElastic &&
                  orderData.customSize.sheet.mattressHeight
                    ? Number(orderData.customSize.sheet.mattressHeight)
                    : null,
              },
            }
          : // standard set -> provide sheet default sizes and include elastic if user checked it
            (() => {
              const sheetInfo = SIZE_TABLES[orderData.size].find(
                (i) => i.name === "Простирадло"
              );
              const [defL, defW] = parseSize(sheetInfo?.size);
              return {
                pillowcase: null,
                duvet: null,
                sheet: {
                  length: Number(orderData.customSize.sheet.length) || defL || null,
                  width: Number(orderData.customSize.sheet.width) || defW || null,
                  withElastic: !!orderData.customSize.sheet.withElastic,
                  mattressHeight:
                    orderData.customSize.sheet.withElastic &&
                    orderData.customSize.sheet.mattressHeight
                      ? Number(orderData.customSize.sheet.mattressHeight)
                      : null,
                },
              };
            })(),
    };

    addToCart(cartItem);
    alert("✅ Додано в кошик");
  };

  // Quick order: show modal -> send to server
  const handleQuickOrderSubmit = async () => {
    try {
      setSubmittingQuick(true);

      // build customSize payload same way as cart
      const customSizePayload =
        orderData.size === "custom"
          ? {
              pillowcase: {
                length: Number(orderData.customSize.pillowcase.length) || null,
                width: Number(orderData.customSize.pillowcase.width) || null,
              },
              duvet: {
                length: Number(orderData.customSize.duvet.length) || null,
                width: Number(orderData.customSize.duvet.width) || null,
              },
              sheet: {
                length: Number(orderData.customSize.sheet.length) || null,
                width: Number(orderData.customSize.sheet.width) || null,
                withElastic: !!orderData.customSize.sheet.withElastic,
                mattressHeight: orderData.customSize.sheet.withElastic
                  ? Number(orderData.customSize.sheet.mattressHeight) || null
                  : null,
              },
            }
          : (() => {
              const sheetInfo = SIZE_TABLES[orderData.size].find(
                (i) => i.name === "Простирадло"
              );
              const [defL, defW] = parseSize(sheetInfo?.size);
              return {
                pillowcase: null,
                duvet: null,
                sheet: {
                  length: Number(orderData.customSize.sheet.length) || defL || null,
                  width: Number(orderData.customSize.sheet.width) || defW || null,
                  withElastic: !!orderData.customSize.sheet.withElastic,
                  mattressHeight: orderData.customSize.sheet.withElastic
                    ? Number(orderData.customSize.sheet.mattressHeight) || null
                    : null,
                },
              };
            })();

      const payload = {
        name: orderData.name,
        phone: orderData.phone,
        size: orderData.size,
        fabricId: fabric._id,
        customSize: customSizePayload,
        comment: orderData.comment || "",
      };

      await axios.post(`${API_BASE}/api/orders`, payload);
      alert("🚀 Швидке замовлення відправлено!");
      setShowQuickModal(false);
    } catch (err) {
      console.error("Помилка швидкого замовлення:", err);
      alert("Помилка при відправці. Перевірте дані та спробуйте ще.");
    } finally {
      setSubmittingQuick(false);
    }
  };

  // gallery / lightbox handlers
  const openLightbox = (img) => {
    setLightboxImage(img);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
  };

  const thumbnails = [
    ...(fabric.additionalImages ?? []),
    ...(fabric.image ? [fabric.image] : []),
  ].filter(Boolean);

  return (
    <div className="fabric-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="fabric-top">
        <div className="gallery">
          {mainImage && (
            <img
              src={`${API_BASE}${mainImage}`}
              alt={fabric.name}
              className="main-img"
              onClick={() => openLightbox(mainImage)}
            />
          )}

          {thumbnails.length > 0 && (
            <div className="thumbs">
              {thumbnails.map((t, i) => (
                <img
                  key={i}
                  src={`${API_BASE}${t}`}
                  alt={`thumb-${i}`}
                  className={`thumb ${t === mainImage ? "active" : ""}`}
                  onClick={() => setMainImage(t)}
                  onDoubleClick={() => openLightbox(t)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="meta">
          <h2>{fabric.name}</h2>
          {fabric.description && <p className="desc">{fabric.description}</p>}
          <p>
            <strong>Ціна:</strong> {fabric.pricePerMeter} грн/м
          </p>
          <p>
            <strong>Статус:</strong> {fabric.inStock ? "в наявності ✅" : "❌"}
          </p>

          <div className="size-row">
            <label>Розмір набору:</label>
            <select
              value={orderData.size}
              onChange={(e) => updateOrder({ size: e.target.value })}
            >
              <option value="1.5">1.5 спальний</option>
              <option value="2">Двоспальний</option>
              <option value="euro">Євро</option>
              <option value="king">King Size</option>
              <option value="custom">Власний розмір</option>
            </select>
          </div>

          {/* For non-custom we still allow user to check "sheet elastic" and optionally enter dimensions */}
          <div className="elastic-row">
            <label>
              <input
                type="checkbox"
                checked={!!orderData.customSize.sheet.withElastic}
                onChange={(e) =>
                  updateCustom("sheet", "withElastic", e.target.checked)
                }
              />
              Простирадло на резинці
            </label>
            {/* optional override sizes / height */}
            {orderData.customSize.sheet.withElastic && (
              <div className="elastic-inputs">
                <input
                  type="number"
                  placeholder="Довжина (см) — опційно"
                  value={orderData.customSize.sheet.length}
                  onChange={(e) => updateCustom("sheet", "length", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Ширина (см) — опційно"
                  value={orderData.customSize.sheet.width}
                  onChange={(e) => updateCustom("sheet", "width", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Висота матрацу (см)"
                  value={orderData.customSize.sheet.mattressHeight}
                  onChange={(e) =>
                    updateCustom("sheet", "mattressHeight", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Standard set table */}
          {orderData.size !== "custom" && (
            <table className="size-table">
              <thead>
                <tr>
                  <th>Елемент</th>
                  <th>Кількість</th>
                  <th>Розмір</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLES[orderData.size].map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.count}</td>
                    <td>{r.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Custom inputs */}
          {orderData.size === "custom" && (
            <div className="custom-block">
              <h4>Вкажіть власні розміри</h4>

              <div className="part">
                <strong>Наволочка</strong>
                <input
                  type="number"
                  placeholder="Довжина (см)"
                  value={orderData.customSize.pillowcase.length}
                  onChange={(e) =>
                    updateCustom("pillowcase", "length", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Ширина (см)"
                  value={orderData.customSize.pillowcase.width}
                  onChange={(e) =>
                    updateCustom("pillowcase", "width", e.target.value)
                  }
                />
              </div>

              <div className="part">
                <strong>Підковдра</strong>
                <input
                  type="number"
                  placeholder="Довжина (см)"
                  value={orderData.customSize.duvet.length}
                  onChange={(e) => updateCustom("duvet", "length", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Ширина (см)"
                  value={orderData.customSize.duvet.width}
                  onChange={(e) => updateCustom("duvet", "width", e.target.value)}
                />
              </div>

              <div className="part">
                <strong>Простирадло</strong>
                <input
                  type="number"
                  placeholder="Довжина (см)"
                  value={orderData.customSize.sheet.length}
                  onChange={(e) => updateCustom("sheet", "length", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Ширина (см)"
                  value={orderData.customSize.sheet.width}
                  onChange={(e) => updateCustom("sheet", "width", e.target.value)}
                />

                <label className="elastic-check">
                  <input
                    type="checkbox"
                    checked={!!orderData.customSize.sheet.withElastic}
                    onChange={(e) =>
                      updateCustom("sheet", "withElastic", e.target.checked)
                    }
                  />
                  Простирадло на резинці
                </label>
                {orderData.customSize.sheet.withElastic && (
                  <input
                    type="number"
                    placeholder="Висота матрацу (см)"
                    value={orderData.customSize.sheet.mattressHeight}
                    onChange={(e) =>
                      updateCustom("sheet", "mattressHeight", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          )}

          <label className="comment">
            Коментар до набору
            <textarea
              placeholder="Наприклад: світліший відтінок, доставка після 18:00..."
              value={orderData.comment}
              onChange={(e) => updateOrder({ comment: e.target.value })}
            />
          </label>

          <div className="actions">
            <button className="btn-add" onClick={handleAddToCart}>
              🛒 Додати в кошик
            </button>
            <button
              className="btn-quick"
              onClick={() => setShowQuickModal(true)}
            >
              ⚡ Швидке замовлення
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="button"
          tabIndex={0}
        >
          <img
            src={`${API_BASE}${lightboxImage}`}
            alt="zoom"
            className="lightbox-img"
          />
        </div>
      )}

      {/* Quick order modal */}
      {showQuickModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚡ Швидке замовлення</h3>
            <p>
              <strong>{fabric.name}</strong>
            </p>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={orderData.name}
              onChange={(e) => updateOrder({ name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Телефон"
              value={orderData.phone}
              onChange={(e) => updateOrder({ phone: e.target.value })}
            />

            <div className="modal-actions">
              <button
                className="btn"
                onClick={handleQuickOrderSubmit}
                disabled={submittingQuick}
              >
                {submittingQuick ? "Відправка..." : "✅ Підтвердити"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowQuickModal(false)}
              >
                ❌ Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
