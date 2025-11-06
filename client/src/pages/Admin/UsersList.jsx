import React, { useEffect, useState } from "react";
import '../styles/UsersList.css'
import '../styles/admin-table.css'
import axios from "axios";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Помилка при отриманні користувачів:", err);
      alert("Не вдалося отримати користувачів");
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("Помилка при зміні ролі");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити користувача?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Помилка при видаленні користувача");
    }
  };

  return (
  <div className="users-list">
    <h3>👥 Користувачі</h3>
    <table>
      <thead>
        <tr>
          <th>Ім'я</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Роль</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td data-label="Ім'я">{u.name}</td>
            <td data-label="Email">{u.email || "-"}</td>
            <td data-label="Телефон">{u.phone || "-"}</td>
            <td data-label="Роль">{u.role}</td>
            <td data-label="Дії">
              <button
                onClick={() =>
                  changeRole(u._id, u.role === "admin" ? "user" : "admin")
                }
              >
                {u.role === "admin"
                  ? "↓ Зробити користувачем"
                  : "↑ Зробити адміном"}
              </button>
              <button onClick={() => deleteUser(u._id)}>🗑️ Видалити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}
