import { useSubscription } from "../context/SubscriptionContext";
import { PLANS } from "../data/plans";
import PricingCard from "../components/billing/PricingCard";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useState, useEffect } from "react";

function nextBillingDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BillingPage() {
  const { plan, clientCount } = useSubscription();

  const [promoDetails, setPromoDetails] = useState(null);

  useEffect(() => {
    if (!window.fpr) return;

    window.fpr("details", function (data) {
      setPromoDetails(data);

      console.log(data);
    });
  }, []);

  if (!plan) return null;

  const usagePct = plan.clientLimit
    ? Math.min((clientCount / plan.clientLimit) * 100, 100)
    : 0;
  const usageColor =
    usagePct >= 90
      ? "bg-red-500"
      : usagePct >= 70
        ? "bg-amber-400"
        : "bg-indigo-500";

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan summary */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Current plan</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-gray-900">
                {plan.name}
              </span>
              <Badge variant="indigo">Active</Badge>
            </div>
            <span className="text-xl font-bold text-gray-700">
              ${plan.price}
              <span className="text-sm font-normal text-gray-400">
                {" "}
                / month
              </span>
            </span>
          </div>

          {/* Client usage bar */}
          {plan.clientLimit && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Client usage</span>
                <span>
                  {clientCount} / {plan.clientLimit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usageColor}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              {usagePct >= 90 && (
                <p className="text-xs text-red-500 mt-1">
                  You're almost at your client limit. Consider upgrading.
                </p>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4 pt-1">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Next billing date</p>
              <p className="text-sm font-semibold text-gray-900">
                {nextBillingDate()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Payment method</p>
              <p className="text-sm font-semibold text-gray-900">
                Visa •••• 4242
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Billing email</p>
              <p className="text-sm font-semibold text-gray-900">
                billing@example.com
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {promoDetails && promoDetails.promo_code && (
        <div>
          <h1 className="text-blue-500">
            Hey you came in with a referral link from{" "}
            {promoDetails.promoter.first_name} {promoDetails.promoter.last_name}{" "}
            You get a 10% discount - {promoDetails.promo_code}
          </h1>
        </div>
      )}
      {/* Plan picker */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Change plan
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <PricingCard
              key={p.id}
              plan={p}
              context="dashboard"
              currentPlanId={plan.id}
              promoDetails={promoDetails}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Upgrades take effect immediately. Downgrades apply at the next billing
          cycle.
        </p>
      </div>
    </div>
  );
}
