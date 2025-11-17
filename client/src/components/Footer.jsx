import React from "react";
import "../pages/styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>🛏️ Bedlinen — не є комерційним проектом а створений виключно як навчальний проєкт</p>
        <div className="footer-socials">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="Telegram">✈️</a>
        </div>
        <p>Контакти: example@mail.com | +380 00 000 00 00</p>
      </div>
    </footer>
  );
}
