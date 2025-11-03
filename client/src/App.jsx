import React, { useState, useEffect } from 'react';
import './App.css';
import Fabrics from "./pages/Fabrics";
import OrderForm from "./pages/OrderForm";
import axios from 'axios';
import UploadFabric from './pages/upload';
// import Login from "./pages/Login";
const API_BASE = "http://localhost:5000";
function App() {
  //  const [user, setUser] = useState(null);
  const [fabrics, setFabrics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);


  // Зміна картинки кожні 3 секунди
  useEffect(() => {
    axios.get(`${API_BASE}/api/fabrics`)
    .then(res => setFabrics(res.data))
    .catch(err => console.error('Помилка завантаження', err));
    
  }, []);

  // console.log(images);

   useEffect(() => {
    if (fabrics.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % fabrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [fabrics]);

  if (fabrics.length === 0) {
    return <div className="loading">Завантаження зображень...</div>;
  }



  const addToCart = (fabric) => {
    if (!fabric) return console.warn('addToCart called with empty fabric');
    setCart(prev => [...prev, fabric]);
  };

   const logout = () => setUser(null);

  return (
    <div className="app">
      <header className="header">
        <div className="nav">
          <h1>🛏️ Bedlinen</h1>
          <div className="nav-buttons">
            {!user ? (
              <button onClick={() => alert('Тут буде логін')}>Увійти</button>
            ) : (
              <>
                <span>Вітаємо, {user.username}</span>
                <button onClick={logout}>Вийти</button>
              </>
            )}
            <button>🛒 Кошик ({cart.length})</button>
          </div>
        </div>
      </header>

      <main>
        <div className="hero">
          <h2>Виберіть свій улюблений дизайн постільної білизни</h2>

          <div className="slider">
            {fabrics.map((fabric, idx) => (
              <img
                key={fabric._id}
                src={`${API_BASE}${fabric.image}`}
                alt={fabric.name}
                className={`slide ${currentIndex === idx ? 'active' : ''}`}
              />
            ))}
          </div>

           <div className="gallery">
            {fabrics.map((fabric, idx) => (
              <img
                key={fabric._id}
                src={`${API_BASE}${fabric.image}`}
                alt={fabric.name}
                className={`thumbnail ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
         <OrderForm cart={cart} />
        <Fabrics fabrics={fabrics} onAddToCart={addToCart} />
        <UploadFabric />
      </main>
    </div>
  );
}

export default App;
