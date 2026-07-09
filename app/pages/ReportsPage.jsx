import { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";
import { MOCK_CLIENTS, RISK_LABELS } from "../data/mockClients";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "../components/ui/Table";
import AllocationPieChart from "../components/clients/AllocationPieChart";

const REPORT_TYPES = ["Quarterly Review", "Portfolio Summary", "Allocation Review", "Performance Report"];

function formatValue(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function calcGrowth(history) {
  if (history.length < 2) return 0;
  return ((history[history.length - 1].value - history[0].value) / history[0].value) * 100;
}

function seedReports(clients) {
  const types = REPORT_TYPES;
  const dates = ["2025-03-31", "2025-04-15", "2025-05-01", "2025-06-30", "2025-07-01"];
  return clients.flatMap((c, ci) =>
    [0, 1].map((ti) => ({
      id:         `r-${c.id}-${ti}`,
      clientId:   c.id,
      clientName: c.name,
      type:       types[(ci + ti) % types.length],
      date:       dates[(ci * 2 + ti) % dates.length],
      status:     "ready",
    }))
  );
}

function ReportPreview({ report, client, advisor }) {
  if (!client) return <p className="text-gray-400 text-sm">Client data unavailable.</p>;

  const growth     = calcGrowth(client.history);
  const monthGrowth = (() => {
    const h = client.history;
    if (h.length < 2) return 0;
    return ((h[h.length - 1].value - h[h.length - 2].value) / h[h.length - 2].value) * 100;
  })();

  return (
    <div id="report-print" className="flex flex-col gap-6 text-sm">
      {/* Report header */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
        <div>
          <p className="text-xl font-extrabold text-indigo-600">Portfolium</p>
          <p className="text-xs text-gray-400 mt-0.5">{advisor?.firm || "Independent Advisory"}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{report.type}</p>
          <p className="text-xs text-gray-400">
            {new Date(report.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Client summary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Client</p>
          <p className="font-semibold text-gray-900">{client.name}</p>
          <p className="text-xs text-gray-400">{client.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Advisor</p>
          <p className="font-semibold text-gray-900">{advisor?.name || "—"}</p>
          <p className="text-xs text-gray-400">{advisor?.firm || "—"}</p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Portfolio value",   value: formatValue(client.portfolioValue) },
          { label: "12-month growth",   value: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`,      color: growth >= 0 ? "text-green-600" : "text-red-500" },
          { label: "Monthly change",    value: `${monthGrowth >= 0 ? "+" : ""}${monthGrowth.toFixed(1)}%`, color: monthGrowth >= 0 ? "text-green-600" : "text-red-500" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{m.label}</p>
            <p className={`text-lg font-extrabold ${m.color || "text-gray-900"}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Risk profile */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Risk profile:</span>
        <Badge variant="indigo">{RISK_LABELS[client.riskProfile]}</Badge>
      </div>

      {/* Allocation */}
      <div>
        <p className="font-semibold text-gray-900 mb-3">Asset allocation</p>
        <div className="grid grid-cols-2 gap-4 items-center">
          <AllocationPieChart allocation={client.allocation} />
          <div className="flex flex-col gap-2">
            {Object.entries(client.allocation).map(([key, pct]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="capitalize text-gray-600">{key}</span>
                <span className="font-semibold text-gray-900">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance history table */}
      <div>
        <p className="font-semibold text-gray-900 mb-3">Monthly performance</p>
        <div className="grid grid-cols-6 gap-1">
          {client.history.map((h, i) => {
            const prev  = client.history[i - 1];
            const delta = prev ? ((h.value - prev.value) / prev.value) * 100 : null;
            return (
              <div key={h.month} className="text-center">
                <p className="text-xs text-gray-400">{h.month}</p>
                <p className="text-xs font-semibold text-gray-900">{formatValue(h.value)}</p>
                {delta !== null && (
                  <p className={`text-xs ${delta >= 0 ? "text-green-500" : "text-red-400"}`}>
                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
        This report is for informational purposes only and does not constitute financial advice.
        Generated by Portfolium on {new Date().toLocaleDateString()}.
      </p>
    </div>
  );
}

export default function ReportsPage() {
  const { currentUser } = useAuth();
  const { clients }     = useSubscription();

  const [reports, setReports]       = useState(() => seedReports(clients));
  const [preview, setPreview]       = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genClientId, setGenClientId] = useState(clients[0]?.id || "");
  const [genType, setGenType]         = useState(REPORT_TYPES[0]);

  function handleGenerate() {
    if (!genClientId) return;
    setGenerating(true);
    setTimeout(() => {
      const client = MOCK_CLIENTS.find((c) => c.id === genClientId);
      const newReport = {
        id:         `r-new-${Date.now()}`,
        clientId:   genClientId,
        clientName: client?.name || "Unknown",
        type:       genType,
        date:       new Date().toISOString().split("T")[0],
        status:     "ready",
      };
      setReports((prev) => [newReport, ...prev]);
      setGenerating(false);
      setPreview(newReport);
    }, 1000);
  }

  const previewClient = preview
    ? MOCK_CLIENTS.find((c) => c.id === preview.clientId)
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and review client portfolio reports.</p>
        </div>
      </div>

      {/* Generate panel */}
      <Card>
        <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Client</label>
            <select
              value={genClientId}
              onChange={(e) => setGenClientId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {clients.length === 0 && <option value="">No clients</option>}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Report type</label>
            <select
              value={genType}
              onChange={(e) => setGenType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleGenerate}
            loading={generating}
            disabled={!genClientId}
            className="shrink-0"
          >
            Generate report
          </Button>
        </div>
      </Card>

      {/* Report list */}
      {reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No reports yet. Generate your first report above.
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <Th>Client</Th>
                <Th>Type</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th></Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <Td>
                    <span className="font-medium text-gray-900">{r.clientName}</span>
                  </Td>
                  <Td>{r.type}</Td>
                  <Td>
                    {new Date(r.date).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </Td>
                  <Td>
                    <Badge variant="green">Ready</Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() => setPreview(r)}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      Preview →
                    </button>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Preview modal */}
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview ? `${preview.type} — ${preview.clientName}` : ""}
        wide
      >
        {preview && (
          <>
            <ReportPreview
              report={preview}
              client={previewClient}
              advisor={currentUser}
            />
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <Button onClick={() => window.print()}>Print / Export PDF</Button>
              <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
