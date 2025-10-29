import React, { useState, useEffect } from 'react';
import './App.css';
import Fabrics from "./pages/Fabrics";
import OrderForm from "./pages/OrderForm";
import axios from 'axios';
import UploadFabric from './pages/upload';
// import Login from "./pages/Login";

function App() {
  //  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);


  // Зміна картинки кожні 3 секунди
  useEffect(() => {
    axios.get('http://localhost:5000/api/fabrics')
    .then(res => setImages(res.data))
    .catch(err => console.error('Помилка завантаження', err));
    
  }, []);
  console.log(images);
   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);



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
            {images.map((item, idx) => (
              <img
                key={item.id || idx}
                src={item.image}
                alt={item.name}
                className={`slide ${currentIndex === idx ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="gallery">
            {images.map((item, idx) => (
              <img
                key={item.id || idx}
                src={item.image}
                alt={item.name}
                className={`thumbnail ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
         <OrderForm cart={cart} />
        <Fabrics fabrics={images} onAddToCart={addToCart} />
        <UploadFabric />
      </main>
    </div>
  );
}

export default App;
