import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 додаємо loading

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
};
console.log("AuthContext user:", user); 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        // console.log("Fetched user:", user)
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false)); // ✅ навіть при помилці
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { identifier, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    console.log("Logged in user:", res.data.user);
  };

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    console.log("Registered user:", res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
  value={{
    user,
    loading,
    login,
    register,
    logout,
    updateUser, // 👈 ДОДАЛИ
  }}
>

      {children}
    </AuthContext.Provider>
  );
};
