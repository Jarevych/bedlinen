import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useContext } from "react";
// import ReactDOM from "react-dom/client";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UploadFabric from "./pages/AddFabric";
import Cart from "./pages/Cart";
import FabricDetails from "./pages/FabricDetails";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext.jsx";
import ProfileDashboard from "./pages/Profile/ProfileDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import AdminDashboard from "./pages/AdminDashboard";

const API_BASE = "http://localhost:5000";
function App() {
   const { user, logout } = useContext(AuthContext);
  // тимчасово: у майбутньому сюди додамо перевірку isAdmin
  const [cart, setCart] = useState([]);
  console.log(user)
  
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-logo">🛏️ Bedlinen</Link>
        <div className="nav-links">
          {isAdmin && <Link to="/admin" className="btn-add">Адмін панель</Link>}

          {user ? (
            <>
              <Link to="/profile">👤 Кабінет</Link>
              <button onClick={logout} className="btn-logout">Вийти</button>
            </>
          ) : (
            <>
              <Link to="/login">Увійти</Link>
              <Link to="/register">Реєстрація</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAdmin && <Route path="/add-fabric" element={
          <ProtectedRoute adminOnly>
          <UploadFabric />
        </ProtectedRoute>} />}
        <Route path="/fabric/:id" element={<FabricDetails />} /> {/* ← нова сторінка */}
        <Route path="/profile" element={
           <ProtectedRoute>
        <ProfileDashboard />
      </ProtectedRoute>
          } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
