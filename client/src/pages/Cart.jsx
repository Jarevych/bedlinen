import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  if (cart.length === 0) {
    return <div className="cart-empty">Ваш кошик порожній 🛒</div>;
  }

  return (
    <div className="cart-container">
      <h2>Ваш кошик</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item._id} className="cart-item">
            <img src={`http://localhost:5000${item.image}`} alt={item.name} />
            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>{item.price ? `${item.price} грн` : "Ціну уточнюйте"}</p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <button className="clear-btn" onClick={clearCart}>
        Очистити кошик
      </button>
    </div>
  );
}

export default Cart;
