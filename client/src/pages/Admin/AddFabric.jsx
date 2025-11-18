import React, { useState } from "react";
import axios from "axios";
import "../styles/AddFabric.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const token = localStorage.getItem("token");
export default function AddFabric() {
  const [form, setForm] = useState({
    name: "",
    pricePerMeter: "",
    fabric: "Бязь",
    description: "",
    inStock: true,
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => {
    setMainImageFile(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("pricePerMeter", form.pricePerMeter);
      data.append("fabric", form.fabric);
      data.append("description", form.description);
      data.append("inStock", form.inStock);

      if (mainImageFile) data.append("image", mainImageFile);
      additionalImages.forEach((file) => data.append("additionalImages", file));

      await axios.post(`${API_BASE}/api/fabrics`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Тканину успішно додано!");
      setForm({
        name: "",
        pricePerMeter: "",
        fabric: "Бязь",
        description: "",
        inStock: true,
      });
      setMainImageFile(null);
      setAdditionalImages([]);
    } catch (err) {
      console.error("Помилка при додаванні тканини:", err);
      alert("Помилка при додаванні тканини");
    }
  };

  return (
    <div className="add-fabric">
      <h3>➕ Додати нову тканину</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Назва"
          required
        />
        <input
          name="pricePerMeter"
          value={form.pricePerMeter}
          onChange={handleChange}
          placeholder="Ціна за метр"
          required
        />
        <select name="fabric" value={form.fabric} onChange={handleChange}>
          <option value="Бязь">Бязь</option>
          <option value="Сатин">Сатин</option>
          <option value="Байка">Байка</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Опис"
        ></textarea>
        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={form.inStock}
            onChange={handleChange}
          />{" "}
          В наявності
        </label>

        <label>
          Основне фото:
          <input type="file" onChange={handleMainImageChange} />
        </label>

        <label>
          Додаткові фото:
          <input type="file" multiple onChange={handleAdditionalImagesChange} />
        </label>

        <button type="submit">Додати</button>
      </form>
    </div>
  );
}
