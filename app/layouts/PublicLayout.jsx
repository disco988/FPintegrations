import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PublicLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            XYZ SaaS
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/pricing" className="hover:text-gray-900">
              Pricing
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-900">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="hover:text-gray-900">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-900">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
