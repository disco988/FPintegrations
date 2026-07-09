import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../data/plans";



export default function CheckoutSuccess() {
  const { currentUser } = useAuth();
  const plan = PLANS.find((p) => p.id === currentUser.planId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 max-w-md mx-auto">
      <div className="text-6xl">🎉</div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment successful!
        </h1>
        <p className="text-gray-500">
          You're now on the{" "}
          <span className="font-semibold text-indigo-600">{plan.name}</span>{" "}
          plan. Your account has been updated.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 w-full text-left">
        <p className="text-sm font-semibold text-indigo-900 mb-2">
          What's included
        </p>
        <ul className="flex flex-col gap-1.5">
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-sm text-indigo-800"
            >
              <span className="text-indigo-500">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
