import React from "react";

export default function AccountInfo({ user }) {
  console.log(user)
  return (
    <div className="account-info">
      <h3>Мої дані</h3>
      <p><strong>Ім’я:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email || "—"}</p>
      <p><strong>Телефон:</strong> {user.phone || "—"}</p>
    </div>
  );
}
