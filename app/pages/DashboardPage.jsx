import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";
import { useSubscription } from "../context/SubscriptionContext";
import StatCard from "../components/dashboard/StatCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import UpgradePrompt from "../components/dashboard/UpgradePrompt";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import { StatCardSkeleton } from "../components/ui/Skeleton";

function formatAUM(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function buildAggregateHistory(clients) {
  if (!clients.length) return [];
  return clients[0].history.map((_, i) => ({
    month: clients[0].history[i].month,
    value: clients.reduce((sum, c) => sum + c.history[i].value, 0),
  }));
}

function calcGrowth(history) {
  if (history.length < 2) return 0;
  return ((history[history.length - 1].value - history[0].value) / history[0].value) * 100;
}

export default function DashboardPage() {
  const { plan, clients, clientCount, atLimit, points } = useSubscription();

  const totalAUM          = clients.reduce((sum, c) => sum + c.portfolioValue, 0);
  const aggregateHistory  = buildAggregateHistory(clients);
  const growth            = calcGrowth(aggregateHistory);

  const riskCounts    = clients.reduce((acc, c) => { acc[c.riskProfile] = (acc[c.riskProfile] || 0) + 1; return acc; }, {});
  const dominantRisk  = Object.entries(riskCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Empty state for new users with no clients
  if (!clients.length) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center flex flex-col items-center gap-4">
          <div className="text-5xl">👥</div>
          <h2 className="text-lg font-semibold text-gray-900">No clients yet</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Add your first client to start tracking portfolios and see your dashboard come to life.
          </p>
          <Link
            to="/clients"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your practice —{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {atLimit && plan && (
        <UpgradePrompt planName={plan.name} clientLimit={plan.clientLimit} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total AUM"      value={formatAUM(totalAUM)} trend={growth} sub="12-month growth" icon="💼" />
        <StatCard label="Active Clients" value={clientCount} sub={plan?.clientLimit ? `of ${plan.clientLimit} on ${plan.name}` : `on ${plan?.name}`} icon="👥" />
        <StatCard label="Avg Portfolio"  value={clientCount ? formatAUM(Math.round(totalAUM / clientCount)) : "—"} sub="per client" icon="📊" />
        <StatCard label="Dominant Risk"  value={dominantRisk.charAt(0).toUpperCase() + dominantRisk.slice(1)} sub="most common profile" icon="⚖️" />
        <StatCard label="Reward Points"  value={points.toLocaleString()} sub="redeemable rewards" icon="🎁" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-semibold text-gray-900 text-sm">Total AUM — last 12 months</h2>
          </CardHeader>
          <CardBody className="pt-2">
            {aggregateHistory.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={aggregateHistory} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatAUM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip formatter={(v) => [formatAUM(v), "AUM"]} contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#aumGradient)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data to display.</div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 text-sm">Recent activity</h2>
          </CardHeader>
          <CardBody className="py-1 px-4">
            <ActivityFeed clients={clients} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
