import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function UploadFabric({ onCreated }) {
  const { user, loading } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  if (loading) return <p>Завантаження...</p>;

  // 🔐 Перевірка авторизації після того, як контекст готовий
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <h2>🚫 Доступ лише для адміністратора</h2>;

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose file first");

    const token = localStorage.getItem("token");

    // 1️⃣ upload
    const fd = new FormData();
    fd.append("image", file);
    const uploadRes = await axios.post("http://localhost:5000/api/fabrics/upload", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    const imageUrl = uploadRes.data.imageUrl;

    // 2️⃣ create
    const createRes = await axios.post(
      "http://localhost:5000/api/fabrics",
      { name, pricePerMeter: Number(price), image: imageUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setName("");
    setPrice("");
    setFile(null);

    if (onCreated) onCreated(createRes.data);
    alert("Fabric created");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
      <input type="number" placeholder="Price per meter" value={price} onChange={(e)=>setPrice(e.target.value)} />
      <input type="file" accept="image/*" onChange={handleFile} />
      <button type="submit">Upload & Create</button>
    </form>
  );
}
