import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const images = [
    '/bed1.jpg',
    '/bed2.jpg',
    '/bed3.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Зміна картинки кожні 3 секунди
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="app">
      <header className="header">
        <h1>Ласкаво просимо до Bedlinen!</h1>
        <p>Виберіть свій улюблений дизайн постільної білизни:</p>
      </header>

      <main>
        <div className="slider">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Білизна ${idx + 1}`}
              className={`slide ${currentIndex === idx ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="gallery">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Білизна ${idx + 1}`}
              className={`thumbnail ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
