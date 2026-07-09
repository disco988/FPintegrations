import { Link } from "react-router";
import { PLANS } from "../data/plans";

export default function Pricing() {
  return (

// Pricing Header

    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Simple, transparent pricing
          </h1>
        </div>

// Plans UI 

        <div className="grid sm:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-8 flex flex-col gap-6 ${
                plan.highlighted
                  ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600"
                  : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="self-start text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  {`$${plan.price}`}
                </span>
                <span className="text-gray-400 mb-1">/ {plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-indigo-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.price === 0 ? "/signup" : "/checkout"}
                className={`text-center py-2.5 rounded-lg font-semibold text-sm mt-auto transition-colors ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {`Get ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
