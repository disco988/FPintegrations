import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-lg font-extrabold text-indigo-600">Portfolium</span>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
        </div>
        <p className="text-sm text-gray-400">© 2025 Portfolium. All rights reserved.</p>
      </div>
    </footer>
  );
}
