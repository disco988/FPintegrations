import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/pricing", label: "Pricing" },
  { to: "/docs",    label: "Docs" },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setOpen(false);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-indigo-600" onClick={() => setOpen(false)}>
          Portfolium
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gray-900 transition-colors">{l.label}</Link>
          ))}
          {currentUser ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-900 transition-colors">Log in</Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`py-1 ${location.pathname === l.to ? "text-indigo-600" : "text-gray-700"}`}
            >
              {l.label}
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="py-1 text-gray-700">Dashboard</Link>
              <button onClick={handleLogout} className="text-left py-1 text-red-600">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="py-1 text-gray-700">Log in</Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-center font-semibold"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
