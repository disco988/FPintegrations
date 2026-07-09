import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../data/plans";

export default function Billing() {
  const { currentUser } = useAuth();
  const plan = PLANS.find((p) => p.id === currentUser.planId);

  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const nextBilling = nextBillingDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Current plan</h2>
          <Link
            to="/checkout"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            {!plan ? "Choose Plan" : "Change Plan"}
          </Link>
        </div>
        {!plan ? (
          <p className="text-sm text-gray-600">
            You don't have an active plan yet.
            <Link
              to="/checkout"
              className="text-indigo-600 hover:underline font-medium"
            >
              Choose a plan
            </Link>
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {plan.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Active
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Amount</p>
                <p className="font-semibold text-gray-900">
                  {`$${plan.price} / month`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Next billing</p>
                <p className="font-semibold text-gray-900">{nextBilling}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Payment method</p>
                <p className="font-semibold text-gray-900">{"Visa XXXX"}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
