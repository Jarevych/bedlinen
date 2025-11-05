import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <Link to="/" className="font-bold text-lg">🛏️ Постіль</Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === "admin" ? (
              <Link to="/admin" className="hover:underline">Адмінка</Link>
            ) : (
              <Link to="/profile" className="hover:underline">Кабінет</Link>
            )}
            <button
              onClick={logout}
              className="text-red-500 hover:underline"
            >
              Вихід
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Увійти</Link>
            <Link to="/register" className="hover:underline">Реєстрація</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
