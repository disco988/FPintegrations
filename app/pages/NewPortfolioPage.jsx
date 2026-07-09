import { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { MOCK_CLIENTS, RISK_COLORS } from "../data/mockClients";
import AllocationPieChart from "../components/clients/AllocationPieChart";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

// Base allocations per risk profile
const BASE_ALLOCATIONS = {
  conservative: { stocks: 25, bonds: 60, cash: 15 },
  balanced:     { stocks: 60, bonds: 30, cash: 10 },
  aggressive:   { stocks: 80, bonds: 15, cash:  5 },
};

// Horizon shifts stocks up/down and rebalances bonds
const HORIZON_SHIFTS = {
  short:  -10,
  medium:   0,
  long:    10,
};

const RISK_OPTIONS = [
  {
    id: "conservative",
    label: "Conservative",
    icon: "🛡️",
    desc: "Capital preservation. Lower returns, lower volatility. Suitable for clients near retirement.",
  },
  {
    id: "balanced",
    label: "Balanced",
    icon: "⚖️",
    desc: "Growth with stability. Mix of equities and fixed income. Suitable for medium-term goals.",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    icon: "🚀",
    desc: "Maximum growth potential. High equity exposure. Suitable for long horizons and high risk tolerance.",
  },
];

const HORIZON_OPTIONS = [
  { id: "short",  label: "Short",  sub: "< 3 years" },
  { id: "medium", label: "Medium", sub: "3 – 10 years" },
  { id: "long",   label: "Long",   sub: "> 10 years" },
];

function buildAllocation(riskProfile, horizon) {
  const base  = { ...BASE_ALLOCATIONS[riskProfile] };
  const shift = HORIZON_SHIFTS[horizon];

  let stocks = Math.min(95, Math.max(5, base.stocks + shift));
  let bonds  = Math.min(90, Math.max(0, base.bonds  - Math.round(shift * 0.7)));
  let cash   = Math.max(0, 100 - stocks - bonds);

  // Normalise so they sum to exactly 100
  const total = stocks + bonds + cash;
  if (total !== 100) cash += 100 - total;

  return { stocks, bonds, cash };
}

function formatValue(v) {
  if (!v) return "—";
  const n = Number(v.replace(/,/g, ""));
  if (isNaN(n)) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function generateNarrative(client, risk, horizon, allocation) {
  const clientName = client ? client.name : "the client";
  const horizonText = { short: "a short investment horizon of less than 3 years", medium: "a medium-term horizon of 3–10 years", long: "a long-term horizon of over 10 years" }[horizon];
  return `Based on ${clientName}'s ${risk} risk profile and ${horizonText}, we recommend an allocation of ${allocation.stocks}% equities, ${allocation.bonds}% fixed income, and ${allocation.cash}% cash equivalents. This positioning balances ${risk === "aggressive" ? "growth potential with manageable drawdown risk" : risk === "balanced" ? "capital growth with downside protection" : "capital preservation with modest income generation"}.`;
}

export default function NewPortfolioPage() {
  const { clients } = useSubscription();

  const [clientId,   setClientId]   = useState("");
  const [riskProfile, setRiskProfile] = useState("balanced");
  const [horizon,     setHorizon]     = useState("medium");
  const [aum,         setAum]         = useState("");
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [saved,       setSaved]       = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId) || null;
  const previewAlloc   = buildAllocation(riskProfile, horizon);

  function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      setResult({
        client:     selectedClient,
        riskProfile,
        horizon,
        allocation: previewAlloc,
        aum,
        generatedAt: new Date().toLocaleString(),
      });
      setLoading(false);
    }, 900);
  }

  function handleSave() {
    if (!result?.client) {
      setSaved(true);
      return;
    }
    const client = MOCK_CLIENTS.find((c) => c.id === result.client.id);
    if (client) {
      if (!client.recommendations) client.recommendations = [];
      client.recommendations.unshift({
        id: `rec-${Date.now()}`,
        riskProfile: result.riskProfile,
        horizon: result.horizon,
        allocation: result.allocation,
        aum: result.aum,
        generatedAt: result.generatedAt,
      });
    }
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New portfolio recommendation</h1>
        <p className="text-gray-500 text-sm mt-1">
          Build an allocation recommendation based on a client's risk profile and investment horizon.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">

        {/* Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-3 flex flex-col gap-5">

          {/* Client selector */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900 text-sm">Client</h2></CardHeader>
            <CardBody>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">— Select a client (optional) —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {selectedClient && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Badge variant={RISK_COLORS[selectedClient.riskProfile]}>
                    {selectedClient.riskProfile}
                  </Badge>
                  <span>Current allocation: {selectedClient.allocation.stocks}/{selectedClient.allocation.bonds}/{selectedClient.allocation.cash}</span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Risk profile */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900 text-sm">Risk profile</h2></CardHeader>
            <CardBody className="flex flex-col gap-3">
              {RISK_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                    riskProfile === opt.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="risk"
                    value={opt.id}
                    checked={riskProfile === opt.id}
                    onChange={() => setRiskProfile(opt.id)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {opt.icon} {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </CardBody>
          </Card>

          {/* Investment horizon */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900 text-sm">Investment horizon</h2></CardHeader>
            <CardBody className="grid grid-cols-3 gap-3">
              {HORIZON_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex flex-col items-center text-center border rounded-lg p-4 cursor-pointer transition-colors ${
                    horizon === opt.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="horizon"
                    value={opt.id}
                    checked={horizon === opt.id}
                    onChange={() => setHorizon(opt.id)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-900 text-sm">{opt.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{opt.sub}</span>
                </label>
              ))}
            </CardBody>
          </Card>

          {/* AUM */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900 text-sm">Portfolio value (optional)</h2></CardHeader>
            <CardBody>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  value={aum}
                  onChange={(e) => setAum(e.target.value.replace(/[^0-9,]/g, ""))}
                  placeholder="e.g. 250,000"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </CardBody>
          </Card>

          <Button type="submit" loading={loading} className="w-full">
            Generate recommendation
          </Button>
        </form>

        {/* Live preview */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900 text-sm">Allocation preview</h2>
            </CardHeader>
            <CardBody>
              <AllocationPieChart allocation={previewAlloc} />
              <div className="mt-2 flex flex-col gap-1.5">
                {Object.entries(previewAlloc).map(([key, pct]) => (
                  <div key={key} className="flex justify-between text-xs text-gray-600">
                    <span className="capitalize">{key}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Updates live as you adjust inputs
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Result */}
      {result && (
        <Card className="border-indigo-200 bg-indigo-50/40">
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recommendation</h2>
            <span className="text-xs text-gray-400">{result.generatedAt}</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={RISK_COLORS[result.riskProfile]}>
                {result.riskProfile.charAt(0).toUpperCase() + result.riskProfile.slice(1)}
              </Badge>
              <Badge variant="gray">
                {HORIZON_OPTIONS.find((h) => h.id === result.horizon)?.label} horizon
              </Badge>
              {result.aum && (
                <Badge variant="gray">AUM {formatValue(result.aum)}</Badge>
              )}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {generateNarrative(result.client, result.riskProfile, result.horizon, result.allocation)}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {Object.entries(result.allocation).map(([key, pct]) => (
                <div key={key} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400 capitalize mb-1">{key}</p>
                  <p className="text-xl font-extrabold text-gray-900">{pct}%</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {saved ? (
                <span className="text-sm text-green-600 font-medium">✓ Saved to client record</span>
              ) : (
                <Button onClick={handleSave}>Save recommendation</Button>
              )}
              <Button variant="outline" onClick={() => window.print()}>
                Print / export
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
