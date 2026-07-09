import { Link } from "react-router";
import { FEATURES } from "../data/features";

export default function Home() {
  return (
    <div>
      // Main Section
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The platform your team has been waiting for
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            XYZ SaaS brings together everything you need to ship faster,
            collaborate better, and grow with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700"
            >
              Start now
            </Link>
            <Link
              to="/pricing"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            We offer a 14-day return policy
          </p>
        </div>
      </section>
      // Features
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Everything you need, nothing you don't
          </h2>
          <p className="text-gray-500 text-lg">
            Built for modern teams that move fast.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="py-24 px-6 text-center bg-indigo-600">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-indigo-200 mb-8 text-lg">
          Join thousands of teams already using XYZ SaaS.
        </p>
        <Link
          to="/signup"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50"
        >
          Create your account
        </Link>
      </section>
    </div>
  );
}
