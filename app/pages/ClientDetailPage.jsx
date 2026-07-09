import { useParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { MOCK_CLIENTS, RISK_LABELS, RISK_COLORS } from "../data/mockClients";
import AllocationPieChart from "../components/clients/AllocationPieChart";
import PortfolioHistoryChart from "../components/clients/PortfolioHistoryChart";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

function formatValue(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function calcGrowth(history) {
  if (history.length < 2) return 0;
  const first = history[0].value;
  const last  = history[history.length - 1].value;
  return ((last - first) / first) * 100;
}

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const client = MOCK_CLIENTS.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-500">Client not found.</p>
        <Link to="/clients" className="text-indigo-600 hover:underline text-sm">
          ← Back to clients
        </Link>
      </div>
    );
  }

  const hasAccess = (currentUser.clients || []).includes(client.id);
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-500">You don't have access to this client.</p>
        <Link to="/clients" className="text-indigo-600 hover:underline text-sm">
          ← Back to clients
        </Link>
      </div>
    );
  }

  const recs = client.recommendations || [];

  const growth = calcGrowth(client.history);
  const latestHistory = client.history[client.history.length - 1];
  const prevHistory   = client.history[client.history.length - 2];
  const monthChange   = latestHistory && prevHistory
    ? ((latestHistory.value - prevHistory.value) / prevHistory.value) * 100
    : 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/clients")}
            className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1"
          >
            ← Clients
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-400">{client.email} · Client since {client.joinedAt}</p>
            </div>
          </div>
        </div>
        <Link to="/portfolios/new">
          <Button size="sm">New recommendation</Button>
        </Link>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Portfolio value",
            value: formatValue(client.portfolioValue),
          },
          {
            label: "12-month growth",
            value: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`,
            color: growth >= 0 ? "text-green-600" : "text-red-500",
          },
          {
            label: "This month",
            value: `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(1)}%`,
            color: monthChange >= 0 ? "text-green-600" : "text-red-500",
          },
          {
            label: "Risk profile",
            badge: (
              <Badge variant={RISK_COLORS[client.riskProfile]}>
                {RISK_LABELS[client.riskProfile]}
              </Badge>
            ),
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            {s.badge || (
              <p className={`text-xl font-bold ${s.color || "text-gray-900"}`}>{s.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <h2 className="font-semibold text-gray-900 text-sm">Portfolio history — 12 months</h2>
          </CardHeader>
          <CardBody className="pt-2">
            <PortfolioHistoryChart history={client.history} />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-semibold text-gray-900 text-sm">Asset allocation</h2>
          </CardHeader>
          <CardBody>
            <AllocationPieChart allocation={client.allocation} />
            <div className="mt-2 flex flex-col gap-1.5">
              {Object.entries(client.allocation).map(([key, pct]) => (
                <div key={key} className="flex justify-between text-xs text-gray-600">
                  <span className="capitalize">{key}</span>
                  <span className="font-semibold">{pct}%</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Last activity */}
      <Card>
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Last activity</p>
            <p className="text-sm font-medium text-gray-800">{client.lastActivity}</p>
          </div>
          <Link to="/reports">
            <Button variant="outline" size="sm">View reports</Button>
          </Link>
        </CardBody>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Portfolio recommendations</h2>
          <Link to="/portfolios/new">
            <Button size="sm" variant="outline">+ New</Button>
          </Link>
        </CardHeader>
        {recs.length === 0 ? (
          <CardBody>
            <p className="text-sm text-gray-400 text-center py-4">
              No recommendations yet.{" "}
              <Link to="/portfolios/new" className="text-indigo-600 hover:underline">
                Create one
              </Link>
              .
            </p>
          </CardBody>
        ) : (
          <div className="divide-y divide-gray-100">
            {recs.map((rec) => (
              <div key={rec.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={RISK_COLORS[rec.riskProfile]}>
                    {rec.riskProfile.charAt(0).toUpperCase() + rec.riskProfile.slice(1)}
                  </Badge>
                  <Badge variant="gray">
                    {rec.horizon.charAt(0).toUpperCase() + rec.horizon.slice(1)} horizon
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {rec.allocation.stocks}% stocks · {rec.allocation.bonds}% bonds · {rec.allocation.cash}% cash
                  </span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{rec.generatedAt}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
}
