import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../data/plans";

export default function Checkout() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState(
    currentUser.planId === "free" ? "pro" : currentUser.planId,
  );

  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUser({ planId: selectedPlanId });
      navigate("/checkout/success");
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose your plan and enter payment details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Plan selector */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Select a plan</h2>
          <div className="flex flex-col gap-3">
            {PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPlanId === plan.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlanId === plan.id}
                  onChange={() => setSelectedPlanId(plan.id)}
                  className="accent-indigo-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
                <span className="font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-xs font-normal text-gray-400">/mo</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Go to Checkout
        </button>
      </form>
    </div>
  );
}
