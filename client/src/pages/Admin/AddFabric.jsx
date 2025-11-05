import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function AddFabric() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    inStock: true,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/fabrics`, form);
      alert("✅ Постіль успішно додано!");
      setForm({ name: "", price: "", type: "", inStock: true, description: "" });
    } catch (err) {
      console.error("Помилка при додаванні постелі:", err);
    }
  };

  return (
    <div className="add-fabric">
      <h3>➕ Додати нову постіль</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Назва" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Ціна" required />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Тип тканини" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Опис"></textarea>
        <label>
          <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} /> В наявності
        </label>
        <button type="submit">Додати</button>
      </form>
    </div>
  );
}
