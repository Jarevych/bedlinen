import React, { useContext, useState } from "react";
import axios from "axios";
import "../pages/styles/Cart.css";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Cart() {
  const { cart, removeFromCart, clearCart, updateCartItem } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    comment: "", // 🆕 додали поле коментаря
  });

  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return <div className="cart-empty">Ваш кошик порожній 🛒</div>;
  }

  const handleSizeChange = (id, newSize) => {
    updateCartItem(id, { size: newSize });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const item of cart) {
        const customSize =
          item.size === "custom"
            ? {
                pillowcase: {
                  length: Number(item.customSize?.наволочка?.length) || null,
                  width: Number(item.customSize?.наволочка?.width) || null,
                },
                duvet: {
                  length: Number(item.customSize?.підковдра?.length) || null,
                  width: Number(item.customSize?.підковдра?.width) || null,
                },
                sheet: {
                  length: Number(item.customSize?.простирадло?.length) || null,
                  width: Number(item.customSize?.простирадло?.width) || null,
                  withElastic: !!item.customSize?.простирадло?.elastic, // 🧩 виправлено
                  mattressHeight: item.customSize?.простирадло?.height
                    ? Number(item.customSize?.простирадло?.height)
                    : null, // 🧩 виправлено
                },
              }
            : null;

        await axios.post(`${API_BASE}/api/orders`, {
          name: formData.name,
          phone: formData.phone,
          size: item.size || "queen",
          fabricId: item._id,
          customSize,
          comment: item.comment || "", // 🆕 додаємо коментар
        });
      }

      alert("🚀 Ваше замовлення успішно оформлено!");
      clearCart();
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        comment: "",
      });
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      alert("Сталася помилка при оформленні замовлення. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Ваш кошик</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item._id} className="cart-item">
            <img src={`${API_BASE}${item.image}`} alt={item.name} />
            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>
                {item.pricePerMeter
                  ? `${item.pricePerMeter} грн`
                  : "Ціну уточнюйте"}
              </p>

              <select
                value={item.size || "queen"}
                onChange={(e) => handleSizeChange(item._id, e.target.value)}
              >
                <option value="1.5">1.5 спальний</option>
                <option value="2">Двоспальний</option>
                <option value="euro">Євро</option>
                <option value="king">King Size</option>
                <option value="custom">Власний розмір</option>
              </select>
            </div>

            {/* Якщо власний розмір */}
            {item.size === "custom" && (
              <div className="custom-size-fields">
                <h5>Введіть власні розміри:</h5>

                {["Наволочка", "Підковдра", "Простирадло"].map((part) => {
                  const key = part.toLowerCase(); // наволочка / підковдра / простирадло

                  return (
                    <div key={part} className="custom-part">
                      <strong>{part}</strong>

                      <input
                        type="number"
                        placeholder="Довжина (см)"
                        onChange={(e) =>
                          updateCartItem(item._id, {
                            customSize: {
                              ...item.customSize,
                              [key]: {
                                ...item.customSize?.[key],
                                length: e.target.value,
                              },
                            },
                          })
                        }
                      />

                      <input
                        type="number"
                        placeholder="Ширина (см)"
                        onChange={(e) =>
                          updateCartItem(item._id, {
                            customSize: {
                              ...item.customSize,
                              [key]: {
                                ...item.customSize?.[key],
                                width: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  );
                })}

                {/* Опція на резинці */}
                <div className="sheet-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={item.customSize?.простирадло?.elastic || false}
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          customSize: {
                            ...item.customSize,
                            простирадло: {
                              ...item.customSize?.простирадло,
                              elastic: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    Простирадло на резинці
                  </label>

                  {item.customSize?.простирадло?.elastic && (
                    <input
                      type="number"
                      placeholder="Висота матрацу (см)"
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          customSize: {
                            ...item.customSize,
                            простирадло: {
                              ...item.customSize?.простирадло,
                              height: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  )}
                </div>
              </div>
            )}

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {/* 🧾 Форма замовлення */}
      <form className="order-form" onSubmit={handleOrder}>
        <h3>Оформлення замовлення</h3>
        <input
          type="text"
          placeholder="Ваше ім'я"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Ваш телефон"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        {/* 📝 Нове поле для коментаря */}
        {/* <textarea
          placeholder="Коментар до замовлення (необов’язково)"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={3}
        /> */}
        <button type="submit" className="order-btn" disabled={loading}>
          {loading ? "⏳ Відправлення..." : "✅ Підтвердити замовлення"}
        </button>
      </form>

      <button className="clear-btn" onClick={clearCart}>
        Очистити кошик
      </button>
    </div>
  );
}

export default Cart;
