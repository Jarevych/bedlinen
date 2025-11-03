// example uploader function (client/src/components/UploadFabric.jsx)
import React, { useState } from "react";
import axios from "axios";

export default function UploadFabric({ onCreated }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose file first");

    // 1) upload file
    const fd = new FormData();
    fd.append("image", file);
    const uploadRes = await axios.post("http://localhost:5000/api/fabrics/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const imageUrl = uploadRes.data.imageUrl; // e.g. "/uploads/12345.jpg"

    // 2) create fabric record
    const createRes = await axios.post("http://localhost:5000/api/fabrics", {
      name,
      pricePerMeter: Number(price),
      image: imageUrl,
    });

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
      <select name="fabric" id="">
        <option value="">Бязь</option>
        <option value="">Сатин</option>
        <option value="">Байка</option>

      </select>
      <select name="" id="">
        <option value="">В наявності</option>
        <option value="">Немає в наявності</option>
      </select>

      <input type="file" accept="image/*" onChange={handleFile} />
      <button type="submit">Upload & Create</button>
    </form>
  );
}

//  export default UploadFabric;