import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/profile"); // одразу перекидаємо користувача
    } catch (err) {
      alert(err.response?.data?.message || "Помилка реєстрації");
    }
  };

  return (
    <div className="auth-form">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Ім’я"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="+38 (0XX) XXX-XX-XX"
          value={formData.phone}
          onChange={handleChange}
          required={!formData.email}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
};

export default Register;
