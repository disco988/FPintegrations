import { useEffect, useState } from "react";
import { Link } from "react-router";

const SECTIONS = [
  { id: "introduction",      label: "Introduction" },
  { id: "getting-started",   label: "Getting started" },
  { id: "dashboard",         label: "Dashboard" },
  { id: "clients",           label: "Managing clients" },
  { id: "portfolios",        label: "Portfolio recommendations" },
  { id: "reports",           label: "Reports" },
  { id: "billing",           label: "Billing & plans" },
  { id: "settings",          label: "Account settings" },
  { id: "faq",               label: "FAQ" },
];

function useActiveSection() {
  const [active, setActive] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div className="flex flex-col gap-2 text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-0.5">{title}</p>
        <p className="text-gray-500 text-sm">{children}</p>
      </div>
    </div>
  );
}

function Note({ children }) {
  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 px-4 py-3 rounded-r-lg text-indigo-800 text-sm">
      {children}
    </div>
  );
}

function Warning({ children }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r-lg text-amber-800 text-sm">
      {children}
    </div>
  );
}

function PlanTable() {
  const plans = [
    { name: "Standard", price: "$49/mo", limit: "15 clients",        features: "Portfolio tracking, basic reports" },
    { name: "Premium",  price: "$149/mo", limit: "75 clients",       features: "Advanced allocation, PDF export" },
    { name: "Business", price: "$399/mo", limit: "Unlimited clients", features: "Multi-advisor, white-label reports, SSO" },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["Plan", "Price", "Client limit", "Key features"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {plans.map((p) => (
            <tr key={p.name}>
              <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-700">{p.price}</td>
              <td className="px-4 py-3 text-gray-700">{p.limit}</td>
              <td className="px-4 py-3 text-gray-500">{p.features}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  const active = useActiveSection();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex gap-12 items-start">

        {/* Sticky TOC */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0 sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">On this page</p>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`text-sm py-1 px-3 rounded-lg transition-colors ${
                active === s.id
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {s.label}
            </a>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-12">

          {/* Page header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Portfolium Documentation</h1>
            <p className="text-gray-500 text-base">
              Everything you need to manage your clients, portfolios, and reports.
            </p>
          </div>

          {/* ── Introduction ── */}
          <Section id="introduction" title="Introduction">
            <p>
              Portfolium is a portfolio management platform built for independent financial advisors and small wealth management firms.
              It gives you a single place to track client AUM, review asset allocations, generate investment recommendations, and produce professional reports.
            </p>
            <p>
              This documentation covers every feature of the application — from creating your account to generating your first client report.
              If you're new, start with <strong>Getting started</strong> below.
            </p>
            <Note>
              <strong>Demo credentials:</strong> You can log in with <code className="bg-indigo-100 px-1 rounded">admin@admin.com</code> / <code className="bg-indigo-100 px-1 rounded">admin</code> to explore the app with pre-loaded data.
            </Note>
          </Section>

          {/* ── Getting started ── */}
          <Section id="getting-started" title="Getting started">
            <SubSection title="Creating an account">
              <Step number="1" title="Go to Sign up">
                Click <strong>Get started</strong> in the top navigation or visit <Link to="/signup" className="text-indigo-600 hover:underline">/signup</Link>.
              </Step>
              <Step number="2" title="Fill in your details">
                Enter your full name, email address, and a password (minimum 6 characters). The firm name is optional — leave it blank if you're an independent advisor.
              </Step>
              <Step number="3" title="You're in">
                After signing up you'll land directly on the Dashboard. New accounts start on the <strong>Free plan</strong> — upgrade at any time from the Billing page.
              </Step>
            </SubSection>

            <SubSection title="Logging in">
              <p>
                Visit <Link to="/login" className="text-indigo-600 hover:underline">/login</Link> and enter your email and password.
                Your session is persisted in the browser — you'll stay logged in across page refreshes.
              </p>
            </SubSection>

            <SubSection title="Forgot your password?">
              <Step number="1" title="Request a reset link">
                Click <strong>Forgot password?</strong> on the login page and enter your email. A reset link will be sent (in this demo the link is simulated).
              </Step>
              <Step number="2" title="Set a new password">
                Open the link, enter and confirm your new password, then log in with the new credentials.
              </Step>
            </SubSection>
          </Section>

          {/* ── Dashboard ── */}
          <Section id="dashboard" title="Dashboard">
            <p>
              The Dashboard is your home screen after login. It gives you a live overview of your entire practice at a glance.
            </p>

            <SubSection title="Stat cards">
              <p>The four cards at the top show:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
                <li><strong>Total AUM</strong> — combined value of all client portfolios</li>
                <li><strong>Active Clients</strong> — number of clients on your account, with your plan limit shown</li>
                <li><strong>Avg Portfolio</strong> — average portfolio value per client</li>
                <li><strong>Dominant Risk</strong> — most common risk profile across your clients</li>
              </ul>
            </SubSection>

            <SubSection title="AUM chart">
              <p>
                The area chart shows your total AUM aggregated across all clients over the past 12 months.
                Hover over any point to see the exact value for that month.
              </p>
            </SubSection>

            <SubSection title="Recent activity">
              <p>
                The activity feed on the right lists recent events across your clients — portfolio changes, rebalancing, and updates.
                Click any client name to jump straight to their detail page.
              </p>
            </SubSection>

            <Warning>
              If you've just signed up and haven't added any clients yet, the Dashboard will show empty placeholders.
              Head to <strong>Clients</strong> to add your first client.
            </Warning>
          </Section>

          {/* ── Clients ── */}
          <Section id="clients" title="Managing clients">
            <SubSection title="Client list">
              <p>
                Go to <strong>Clients</strong> in the sidebar to see a table of all your clients. Each row shows the client's name, email, portfolio value, risk profile badge, asset allocation bar, and latest activity note. Click any row to open the client's detail page.
              </p>
            </SubSection>

            <SubSection title="Adding a client">
              <Step number="1" title='Click "+ Add client"'>
                The button appears in the top-right of the Clients page. It's replaced by an <em>Upgrade to add more</em> link if you've reached your plan limit.
              </Step>
              <Step number="2" title="Fill in the form">
                Enter the client's name (required), email (optional — auto-generated if left blank), portfolio value, and select a risk profile.
              </Step>
              <Step number="3" title="Client is added instantly">
                The new client appears in the table immediately. A 12-month history is auto-generated from the initial portfolio value and the Dashboard updates in real time.
              </Step>
              <Note>
                Default asset allocations per risk profile: Conservative (25/60/15), Balanced (60/30/10), Aggressive (80/15/5). You can refine these using the Portfolio Recommendations tool.
              </Note>
            </SubSection>

            <SubSection title="Client detail page">
              <p>
                Clicking a client opens their detail page with:
              </p>
              <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
                <li>Key metrics: portfolio value, 12-month growth, monthly change, risk profile</li>
                <li>Portfolio history chart (12 months)</li>
                <li>Asset allocation donut chart with breakdown</li>
                <li>Last activity note</li>
                <li>Link to generate a new portfolio recommendation</li>
              </ul>
            </SubSection>
          </Section>

          {/* ── Portfolios ── */}
          <Section id="portfolios" title="Portfolio recommendations">
            <p>
              The Portfolio builder at <Link to="/portfolios/new" className="text-indigo-600 hover:underline">Portfolios → New recommendation</Link> helps you
              generate a tailored allocation recommendation for any client in seconds.
            </p>

            <SubSection title="Building a recommendation">
              <Step number="1" title="Select a client (optional)">
                Choose a client from the dropdown to pre-fill their current risk profile and see their existing allocation for reference. You can also run the builder without selecting a client.
              </Step>
              <Step number="2" title="Choose a risk profile">
                Pick Conservative, Balanced, or Aggressive. The <strong>allocation preview</strong> on the right updates live as you change inputs — no need to submit first.
              </Step>
              <Step number="3" title="Set an investment horizon">
                Short (&lt;3 years), Medium (3–10 years), or Long (&gt;10 years). A longer horizon shifts equity exposure up and reduces fixed income accordingly.
              </Step>
              <Step number="4" title="Enter portfolio value (optional)">
                Used purely for display in the recommendation narrative.
              </Step>
              <Step number="5" title="Generate">
                Click <strong>Generate recommendation</strong>. After a moment the result card appears with the final allocation, a plain-English narrative, and save/print actions.
              </Step>
            </SubSection>

            <SubSection title="Allocation logic">
              <p>Base allocations are adjusted by horizon shift (±10% stocks for long/short) with bonds absorbing ~70% of the shift and cash taking the remainder, always summing to exactly 100%.</p>
            </SubSection>
          </Section>

          {/* ── Reports ── */}
          <Section id="reports" title="Reports">
            <p>
              The Reports page lets you generate and preview formatted portfolio reports for any client.
            </p>

            <SubSection title="Generating a report">
              <Step number="1" title="Select a client and report type">
                Use the dropdowns at the top of the Reports page. Available types: Quarterly Review, Portfolio Summary, Allocation Review, Performance Report.
              </Step>
              <Step number="2" title='Click "Generate report"'>
                After ~1 second the report is added to the top of the list with a <em>Ready</em> status.
              </Step>
              <Step number="3" title='Click "Preview →"'>
                Opens a full-screen modal with a print-ready report layout including client info, key metrics, allocation chart, and 12-month performance grid.
              </Step>
            </SubSection>

            <SubSection title="Printing and exporting">
              <p>
                Inside the preview modal, click <strong>Print / Export PDF</strong> to trigger the browser's print dialog.
                Use <em>Save as PDF</em> in the print dialog to export a PDF copy — the report layout is optimised for A4 / Letter.
              </p>
            </SubSection>

            <Note>
              Reports are generated in-memory for this demo. In a production environment they would be stored server-side and accessible as persistent records.
            </Note>
          </Section>

          {/* ── Billing ── */}
          <Section id="billing" title="Billing & plans">
            <p>
              Manage your subscription from the <Link to="/billing" className="text-indigo-600 hover:underline">Billing</Link> page (also accessible from the avatar dropdown in the top-right).
            </p>

            <SubSection title="Plan overview">
              <PlanTable />
            </SubSection>

            <SubSection title="Upgrading or downgrading">
              <p>
                On the Billing page, click <strong>Get [Plan name]</strong> on any card that isn't your current plan.
                This takes you to a Stripe Payment Link where you complete the subscription change securely.
              </p>
              <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
                <li>Upgrades take effect immediately</li>
                <li>Downgrades apply at the next billing cycle</li>
                <li>Your current plan card shows a disabled <em>Your current plan</em> button</li>
              </ul>
            </SubSection>

            <SubSection title="Client limit">
              <p>
                The usage bar on the Billing page shows how many of your plan's client slots are in use.
                The bar turns amber at 70% and red at 90% capacity. When you hit the limit, the <em>+ Add client</em> button is replaced with an upgrade prompt.
              </p>
            </SubSection>
          </Section>

          {/* ── Settings ── */}
          <Section id="settings" title="Account settings">
            <p>
              Access Settings from the sidebar or the avatar dropdown in the top-right corner.
            </p>

            <SubSection title="Profile information">
              <p>Update your full name, email address, and firm name. Changes reflect immediately across the app — the sidebar and report headers use your firm name.</p>
            </SubSection>

            <SubSection title="Changing your password">
              <p>Enter your current password, a new password (min 6 characters), and confirm it. You'll see a <em>✓ Password updated</em> confirmation.</p>
            </SubSection>

            <SubSection title="Notification preferences">
              <p>Toggle email notifications for: weekly digest, drift alerts, client activity, and product updates. Changes are saved immediately.</p>
            </SubSection>

            <SubSection title="Danger zone">
              <p>
                <strong>Delete account</strong> — permanently removes your account (disabled in this demo).<br />
                <strong>Export data</strong> — downloads a JSON copy of all your client and portfolio data (coming soon).
              </p>
            </SubSection>
          </Section>

          {/* ── FAQ ── */}
          <Section id="faq" title="FAQ">
            {[
              {
                q: "Is my data saved between sessions?",
                a: "Yes. Your login session and account details are stored in your browser's localStorage, so you'll stay logged in across page refreshes. Client data is stored in memory for this demo — it resets if you clear your browser storage.",
              },
              {
                q: "Can I have multiple advisors on one account?",
                a: "Multi-advisor support is available on the Business plan. Each advisor gets their own login with access to a shared client book.",
              },
              {
                q: "What happens when I reach my client limit?",
                a: "The '+ Add client' button is replaced with an upgrade prompt. You can still view and manage existing clients, but cannot add new ones until you upgrade.",
              },
              {
                q: "How do I test the Stripe checkout?",
                a: "Update the stripeLink values in app/data/plans.js with your real Stripe Payment Link URLs. The Billing page buttons will then route directly to your Stripe-hosted checkout.",
              },
              {
                q: "How are portfolio recommendations calculated?",
                a: "Recommendations use fixed base allocations per risk profile (Conservative 25/60/15, Balanced 60/30/10, Aggressive 80/15/5) adjusted by investment horizon (±10% equity for long/short). This is a simplified model for demonstration — not financial advice.",
              },
              {
                q: "Can I change a client's risk profile after adding them?",
                a: "Use the Portfolio Recommendations tool to generate a new allocation for any client. The recommendation can then be saved to their record.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-1.5">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </Section>

        </main>
      </div>
    </div>
  );
}
