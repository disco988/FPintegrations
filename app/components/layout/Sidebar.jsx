import { Link, useLocation } from "react-router";

const NAV_ITEMS = [
  { to: "/dashboard",      label: "Dashboard",  icon: "▣" },
  { to: "/clients",        label: "Clients",    icon: "👥" },
  { to: "/portfolios/new", label: "Portfolios", icon: "📊" },
  { to: "/reports",        label: "Reports",    icon: "📄" },
  { to: "/billing",        label: "Billing",    icon: "💳" },
  { to: "/settings",       label: "Settings",   icon: "⚙️" },
];

function NavLinks({ onNavigate }) {
  const { pathname } = useLocation();

  function isActive(to) {
    if (to === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(to);
  }

  return (
    <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(to)
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <span className="text-base leading-none">{icon}</span>
          {label}
        </Link>
      ))}
    </nav>
  );
}

// Desktop sidebar — always visible on lg+
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link to="/dashboard" className="text-lg font-extrabold text-indigo-600">
          Portfolium
        </Link>
      </div>
      <NavLinks />
    </aside>
  );
}

// Mobile drawer — overlay, slides in from left
export function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col lg:hidden shadow-xl">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/dashboard" className="text-lg font-extrabold text-indigo-600" onClick={onClose}>
            Portfolium
          </Link>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <NavLinks onNavigate={onClose} />
      </aside>
    </>
  );
}

export default DesktopSidebar;
