import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddFabric from "./pages/AddFabric";
import Cart from "./pages/Cart";

// import Fabrics from "./pages/Fabrics";
// import OrderForm from "./pages/OrderForm";
// import UploadFabric from './pages/upload';
// import Login from "./pages/Login";
const API_BASE = "http://localhost:5000";
function App() {
  // тимчасово: у майбутньому сюди додамо перевірку isAdmin
  const isAdmin = true; // потім буде заміна на логіку з токеном
  const [cart, setCart] = useState([]);


  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-logo">🛏️ Bedlinen</Link>
        <div className="nav-links">
          {isAdmin && <Link to="/add-fabric" className="btn-add">➕ Додати постіль</Link>}
          <Link to="/login">Увійти</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-fabric" element={<AddFabric />} />
      </Routes>
    </Router>
  );
}

export default App;
