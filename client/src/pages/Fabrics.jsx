import { useEffect, useState } from "react";
import api from "../api";

function Fabrics() {
  const [fabrics, setFabrics] = useState([]);
  const API_BASE = "http://localhost:5000"

  useEffect(() => {
    api.get("/fabrics").then((res) => setFabrics(res.data));
    // console.log(fabrics)
  }, []);

  return (
    <div className="fabrics">
      <h2>Our Fabrics</h2>
      <div className="fabric-grid">
        {fabrics.map((fab) => (
          <div key={fab._id} className="fabric-card">
            <img src={`${API_BASE}${fab.image}`} alt={fab.name} />
            <h3>{fab.name}</h3>
            <p>{fab.pricePerMeter} ₴/м</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fabrics;
