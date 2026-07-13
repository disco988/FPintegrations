import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function PricingCard({
  plan,
  context = "pricing",
  currentPlanId,
}) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [downgradeNotice, setDowngradeNotice] = useState(false);

  const isCurrent = context === "dashboard" && currentPlanId === plan.id;
  const isHighlighted = plan.highlighted && context === "pricing";
  const isFree = plan.price === 0;
  const isOnPaidPlan =
    context === "dashboard" && currentUser && currentPlanId !== "free";

  function handleStripeClick(e) {
    if (!currentUser) {
      e.preventDefault();
      navigate("/login", {
        state: { message: "Please log in to upgrade your plan." },
      });
    }
  }

  function renderButton() {
    if (isCurrent) {
      return (
        <Button variant="secondary" className="w-full" disabled>
          Your current plan
        </Button>
      );
    }

    if (isFree) {
      if (isOnPaidPlan) {
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setDowngradeNotice(true)}
          >
            Downgrade to Free
          </Button>
        );
      }
      return (
        <Link to="/signup">
          <Button variant="outline" className="w-full">
            Get started free
          </Button>
        </Link>
      );
    }

    return (
      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleStripeClick}
      >
        <Button
          variant={isHighlighted ? "primary" : "outline"}
          className="w-full"
        >
          Get {plan.name}
        </Button>
      </a>
    );
  }

  return (
    <div
      className={`rounded-2xl border flex flex-col gap-6 p-8 transition-shadow ${
        isHighlighted
          ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      {isHighlighted && (
        <span className="self-start text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
          Most popular
        </span>
      )}
      {isCurrent && (
        <span className="self-start text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Current plan
        </span>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
      </div>

      <div className="flex items-end gap-1">
        {isFree ? (
          <span className="text-4xl font-extrabold text-gray-900">Free</span>
        ) : (
          <>
            <span className="text-4xl font-extrabold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-400 mb-1.5 text-sm">
              / {plan.period}
            </span>
          </>
        )}
      </div>

      <ul className="flex flex-col gap-2.5 text-sm text-gray-600 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5 shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {renderButton()}

      {downgradeNotice && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 leading-relaxed">
          Your plan will automatically downgrade to Free once your current
          billing period ends. No action required.
          <button
            onClick={() => setDowngradeNotice(false)}
            className="block mt-1.5 text-amber-600 hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
