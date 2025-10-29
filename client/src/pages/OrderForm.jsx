import { useState, useEffect } from "react";
import api from "../api";

function OrderForm() {
  const [fabrics, setFabrics] = useState([]);
  const [order, setOrder] = useState({
    fabric: "",
    width: "",
    length: "",
    height: "",
    customerName: "",
    contact: "",
  });

  useEffect(() => {
    api.get("/fabrics").then((res) => setFabrics(res.data));
  }, []);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/orders", order);
    alert("Order submitted successfully!");
    setOrder({
      fabric: "",
      width: "",
      length: "",
      height: "",
      customerName: "",
      contact: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place your order</h2>
      <select name="fabric" value={order.fabric} onChange={handleChange}>
        <option value="">Select fabric</option>
        {fabrics.map((fab) => (
          <option key={fab._id} value={fab._id}>
            {fab.name}
          </option>
        ))}
      </select>

      <input name="width" placeholder="Width (cm)" value={order.width} onChange={handleChange} />
      <input name="length" placeholder="Length (cm)" value={order.length} onChange={handleChange} />
      <input name="height" placeholder="Height (cm)" value={order.height} onChange={handleChange} />
      <input name="customerName" placeholder="Your name" value={order.customerName} onChange={handleChange} />
      <input name="contact" placeholder="Phone or email" value={order.contact} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default OrderForm;
