import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../data/plans";

const STATS = [
  { label: "Projects", value: "12" },
  { label: "Storage used", value: "8.4 GB" },
  { label: "API calls (30d)", value: "94,201" },
  { label: "Team members", value: "5" },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const plan = PLANS.find((p) => p.id === currentUser.planId);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Current plan</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-indigo-600">
              {currentUser.planId && plan.name}
            </span>
            <span className="text-sm text-gray-500">
              {currentUser.planId === null ? "Free" : `$${plan.price}/mo`}
            </span>
          </div>
          <ul className="text-sm text-gray-600 flex flex-col gap-1 mb-5">
            {currentUser.planId === null
              ? ""
              : plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    {f}
                  </li>
                ))}
          </ul>
          <Link
            to="/checkout"
            className="block text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            {currentUser.planId === null ? "Buy your plan" : "Upgrade plan"}
          </Link>
        </div>
      </div>
    </div>
  );
}
