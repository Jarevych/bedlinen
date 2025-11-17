import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditFabrics.css";

const API_BASE = "http://localhost:5000";

export default function EditFabric() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fabric, setFabric] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [newAdditionalImages, setNewAdditionalImages] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/fabrics/${id}`)
      .then((res) => setFabric(res.data))
      .catch((err) => console.error("Помилка при завантаженні тканини:", err));
  }, [id]);

  if (!fabric) return <p>Завантаження даних...</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFabric((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => {
    setMainImageFile(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setNewAdditionalImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleRemoveAdditionalImage = (index) => {
    setFabric((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSetMainImage = (index) => {
    const selected = fabric.additionalImages[index];
    setFabric((prev) => ({
      ...prev,
      image: selected,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", fabric.name);
      data.append("pricePerMeter", fabric.pricePerMeter);
      data.append("fabric", fabric.fabric);
      data.append("description", fabric.description);
      data.append("inStock", fabric.inStock);

      if (mainImageFile) data.append("image", mainImageFile);
      newAdditionalImages.forEach((file) =>
        data.append("additionalImages", file)
      );
      if (fabric.additionalImages) {
        data.append(
          "existingAdditionalImages",
          JSON.stringify(fabric.additionalImages)
        );
      }

      await axios.put(`${API_BASE}/api/fabrics/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Тканину успішно відредаговано!");
      navigate("/admin");
    } catch (err) {
      console.error("Помилка при редагуванні тканини:", err);
      alert("Помилка при редагуванні тканини");
    }
  };

  return (
    <div className="edit-fabric">
      <h3>✏️ Редагування тканини</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={fabric.name}
          onChange={handleChange}
          placeholder="Назва"
          required
        />
        <input
          name="pricePerMeter"
          value={fabric.pricePerMeter}
          onChange={handleChange}
          placeholder="Ціна за метр"
          required
        />
        <select name="fabric" value={fabric.fabric} onChange={handleChange}>
          <option value="Бязь">Бязь</option>
          <option value="Сатин">Сатин</option>
          <option value="Байка">Байка</option>
        </select>
        <textarea
          name="description"
          value={fabric.description}
          onChange={handleChange}
          placeholder="Опис"
        ></textarea>
        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={fabric.inStock}
            onChange={handleChange}
          />{" "}
          В наявності
        </label>

        <div className="current-images">
          <h4>Основне фото:</h4>
          {fabric.image && (
            <img src={`${API_BASE}${fabric.image}`} alt="Main" />
          )}
          <input type="file" onChange={handleMainImageChange} />
        </div>

        {fabric.additionalImages && fabric.additionalImages.length > 0 && (
          <div className="additional-images">
            <h4>Додаткові фото:</h4>
            <div className="additional-images-grid">
              {fabric.additionalImages.map((img, idx) => (
                <div key={idx} className="additional-image-wrapper">
                  <img src={`${API_BASE}${img}`} alt={`Additional ${idx}`} />
                  <div className="image-actions">
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(idx)}
                    >
                      Зробити основним
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label>
          Додати нові фото:
          <input type="file" multiple onChange={handleAdditionalImagesChange} />
        </label>

        <button type="submit">Зберегти</button>
      </form>
    </div>
  );
}
