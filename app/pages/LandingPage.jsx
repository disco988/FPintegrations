import { Link } from "react-router";

const FEATURES = [
  {
    icon: "📊",
    title: "Unified portfolio view",
    desc: "See all your clients' AUM, allocations, and performance in one dashboard — no more spreadsheets.",
  },
  {
    icon: "⚡",
    title: "Instant recommendations",
    desc: "Generate allocation recommendations based on each client's risk profile in seconds.",
  },
  {
    icon: "📄",
    title: "Professional reports",
    desc: "Send branded PDF reports to clients directly from the platform with one click.",
  },
  {
    icon: "🔔",
    title: "Drift alerts",
    desc: "Get notified when a portfolio drifts beyond its target allocation thresholds.",
  },
  {
    icon: "🔒",
    title: "Bank-grade security",
    desc: "SOC 2 compliant infrastructure. Your clients' data is always encrypted at rest and in transit.",
  },
  {
    icon: "📈",
    title: "Performance analytics",
    desc: "Track historical performance with interactive charts and benchmark comparisons.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Portfolium cut my client review prep time from 3 hours to 20 minutes. I don't know how I managed before.",
    author: "David Lim",
    role: "Independent RIA, 40+ clients",
  },
  {
    quote: "My clients love the reports. It's made a real difference in retention at our annual reviews.",
    author: "Christine Park",
    role: "Partner, Meridian Wealth Group",
  },
  {
    quote: "We migrated from a legacy system and were live in a day. The onboarding was seamless.",
    author: "Anthony Russell",
    role: "Director of Advisory, Summit Capital",
  },
];

const STATS = [
  { value: "$2.4B+", label: "AUM managed on Portfolium" },
  { value: "1,200+", label: "Financial advisors" },
  { value: "18,000+", label: "Client portfolios tracked" },
  { value: "4.9★", label: "Average advisor rating" },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            Built for financial advisors
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage every client portfolio{" "}
            <span className="text-indigo-600">from one place</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Portfolium gives independent advisors and wealth management firms a
            single platform to track AUM, review allocations, generate
            recommendations, and send professional reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
            >
              Get started free
            </Link>
            <Link
              to="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Free plan available · No credit card required
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-indigo-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything your practice needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Stop juggling spreadsheets and disconnected tools. Portfolium
              brings it all together.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Trusted by advisors who manage real money
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4"
              >
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-24 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to take back your time?
        </h2>
        <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
          Join over 1,200 advisors already running their practice on Portfolium.
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-600 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors"
        >
          Get started free
        </Link>
      </section>
    </div>
  );
}
