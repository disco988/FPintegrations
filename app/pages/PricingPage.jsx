import { PLANS } from "../data/plans";
import PricingCard from "../components/billing/PricingCard";

const FAQS = [
  {
    q: "Can I change my plan later?",
    a: "Yes — you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.",
  },
  {
    q: "What counts as a client?",
    a: "Any individual or household with an active portfolio tracked inside Portfolium. Archived clients don't count toward your limit.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Stripe. Annual billing is available with a 20% discount.",
  },
  {
    q: "Is my data secure?",
    a: "Portfolium is SOC 2 Type II certified. All data is encrypted at rest and in transit.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start for free, no credit card required. Scale up as your client book grows.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-8 items-start mb-16">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} context="pricing" />
          ))}
        </div>

        {/* Feature comparison note */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center mb-16">
          <p className="text-indigo-800 text-sm font-medium">
            All plans include portfolio tracking, allocation charts, client management,
            and email support. Higher tiers unlock more clients and advanced features.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <p className="font-semibold text-gray-900 mb-1.5">{faq.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
