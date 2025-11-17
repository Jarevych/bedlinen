import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import "../pages/styles/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo"><img className="header_logo" src="/logo_header.jpg" alt="logo" /></Link>

        {/* Іконки Кабінету та Корзини */}
        <div className="header-icons">
          <button className="icon-btn" onClick={() => navigate(user ? "/profile" : "/login")}>
            👤
          </button>
          <button className="icon-btn" onClick={() => navigate("/cart")}>
            🛒 {cart.length > 0 ? `(${cart.length})` : ""}
          </button>
          {/* Бургер меню для мобайлу */}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        {/* Повне меню */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user?.role === "admin" && <Link to="/admin">Адмінка</Link>}
          {!user && <Link to="/register">Реєстрація</Link>}
          {user && <button className="logout-btn" onClick={logout}>Вийти</button>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
