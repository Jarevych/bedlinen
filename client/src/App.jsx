import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import UploadFabric from "./pages/AddFabric";
import Cart from "./pages/Cart";
import FabricDetails from "./pages/FabricDetails";
import Register from "./pages/Register";
import ProfileDashboard from "./pages/Profile/ProfileDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Header from "./components/Header.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import Footer from "./components/Footer.jsx";
import EditFabric from "./pages/Admin/EditFabrics.jsx";

function App() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      {/* 🔹 Спільний хедер для всіх сторінок */}
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {isAdmin && (
            <Route
              path="/add-fabric"
              element={
                <ProtectedRoute adminOnly>
                  {/* <UploadFabric /> */}
                </ProtectedRoute>
              }
            />
          )}

          <Route path="/fabric/:id" element={<FabricDetails />} />
          <Route path="/admin/edit/:id" element={<EditFabric />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
