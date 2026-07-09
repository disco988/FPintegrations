import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 flex items-center px-8">
        <Link to="/" className="text-xl font-extrabold text-indigo-600">
          Portfolium
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <Outlet />
        </div>
      </main>

      <footer className="h-12 flex items-center justify-center">
        <p className="text-xs text-gray-400">© 2025 Portfolium</p>
      </footer>
    </div>
  );
}
