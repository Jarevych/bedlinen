import React, { useContext, useState } from "react";
import axios from "axios";
import "./cart.css";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function Cart() {
  const { cart, removeFromCart, clearCart, updateCartItem } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
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
        await axios.post(`http://localhost:5000/api/orders`, {
          name: formData.name,
          phone: formData.phone,
          size: item.size || "queen",
          fabricId: item._id,
          customSize: item.customSize
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
        withElastic: !!item.customSize?.sheet?.elastic,
        mattressHeight: item.customSize?.sheet?.height
          ? Number(item.customSize.sheet.height)
          : null,
      },
    }
  : null,
        });
      }
      alert("🚀 Ваше замовлення успішно оформлено!");
      clearCart();
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
            <img src={`http://localhost:5000${item.image}`} alt={item.name} />
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

                {["Наволочка", "Підковдра", "Простирадло"].map((part) => (
                  <div key={part} className="custom-part">
                    <strong>{part}</strong>
                    <input
                      type="number"
                      placeholder="Довжина (см)"
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          customSize: {
                            ...item.customSize,
                            [part.toLowerCase()]: {
                              ...item.customSize?.[part.toLowerCase()],
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
                            [part.toLowerCase()]: {
                              ...item.customSize?.[part.toLowerCase()],
                              width: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                ))}

                {/* Опція на резинці */}
                <div className="sheet-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={item.customSize?.sheet?.elastic || false}
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          customSize: {
                            ...item.customSize,
                            sheet: {
                              ...item.customSize?.sheet,
                              elastic: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    Простирадло на резинці
                  </label>

                  {item.customSize?.sheet?.elastic && (
                    <input
                      type="number"
                      placeholder="Висота матрацу (см)"
                      onChange={(e) =>
                        updateCartItem(item._id, {
                          customSize: {
                            ...item.customSize,
                            sheet: {
                              ...item.customSize?.sheet,
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
        {/* <select
          value={formData.size} 
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        >
          <option value="1.5">1.5 спальний</option>
          <option value="2">Двоспальний</option>
          <option value="euro">Євро</option>
          <option value="king">King Size</option>
          <option value="custom">Власний розмір</option>
        </select> */}
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
