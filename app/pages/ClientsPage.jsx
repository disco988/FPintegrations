import { useState } from "react";
import { Link } from "react-router";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";
import { MOCK_CLIENTS } from "../data/mockClients";
import ClientTable from "../components/clients/ClientTable";
import UpgradePrompt from "../components/dashboard/UpgradePrompt";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Card from "../components/ui/Card";

const DEFAULT_ALLOCATIONS = {
  conservative: { stocks: 25, bonds: 60, cash: 15 },
  balanced:     { stocks: 60, bonds: 30, cash: 10 },
  aggressive:   { stocks: 80, bonds: 15, cash:  5 },
};

const RISK_OPTIONS = [
  { id: "conservative", label: "Conservative" },
  { id: "balanced",     label: "Balanced" },
  { id: "aggressive",   label: "Aggressive" },
];

const MONTH_LABELS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];

function generateHistory(baseValue) {
  let value = baseValue * 0.92;
  return MONTH_LABELS.map((month) => {
    const delta = (Math.random() * 4 - 1.5) / 100;
    value = Math.round(value * (1 + delta));
    return { month, value };
  });
}

const EMPTY_FORM = { name: "", email: "", portfolioValue: "", riskProfile: "balanced" };

export default function ClientsPage() {
  const { plan, clients, clientCount, atLimit } = useSubscription();
  const { currentUser, updateUser } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: "" }));
    };
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    const val = Number(form.portfolioValue.replace(/,/g, ""));
    if (!form.portfolioValue || isNaN(val) || val <= 0)
      errs.portfolioValue = "Enter a valid portfolio value.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    const portfolioValue = Number(form.portfolioValue.replace(/,/g, ""));

    setTimeout(() => {
      const newClient = {
        id:             `c-${Date.now()}`,
        name:           form.name.trim(),
        email:          form.email.trim() || `${form.name.trim().toLowerCase().replace(/\s+/g, ".")}@client.com`,
        portfolioValue,
        riskProfile:    form.riskProfile,
        allocation:     { ...DEFAULT_ALLOCATIONS[form.riskProfile] },
        history:        generateHistory(portfolioValue),
        lastActivity:   "Client added",
        joinedAt:       new Date().toISOString().split("T")[0],
      };

      MOCK_CLIENTS.push(newClient);
      updateUser({ clients: [...(currentUser.clients || []), newClient.id] });

      setSaving(false);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setErrors({});
    }, 600);
  }

  function handleClose() {
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clientCount} client{clientCount !== 1 ? "s" : ""}
            {plan?.clientLimit
              ? ` · ${plan.clientLimit - clientCount} slots remaining on ${plan.name}`
              : plan ? ` · ${plan.name} plan` : ""}
          </p>
        </div>
        {atLimit ? (
          <Link to="/billing">
            <Button variant="outline" size="sm">Upgrade to add more</Button>
          </Link>
        ) : (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            + Add client
          </Button>
        )}
      </div>

      {atLimit && plan && (
        <UpgradePrompt planName={plan.name} clientLimit={plan.clientLimit} />
      )}

      <Card className="overflow-hidden">
        <ClientTable clients={clients} />
      </Card>

      {/* Add client modal */}
      <Modal open={modalOpen} onClose={handleClose} title="Add new client">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="client@example.com"
            value={form.email}
            onChange={set("email")}
            hint="Optional — auto-generated if left blank."
          />
          <Input
            label="Portfolio value ($)"
            type="text"
            required
            placeholder="e.g. 250,000"
            value={form.portfolioValue}
            onChange={set("portfolioValue")}
            error={errors.portfolioValue}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Risk profile</label>
            <div className="grid grid-cols-3 gap-2">
              {RISK_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex flex-col items-center text-center border rounded-lg p-3 cursor-pointer transition-colors ${
                    form.riskProfile === opt.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="riskProfile"
                    value={opt.id}
                    checked={form.riskProfile === opt.id}
                    onChange={set("riskProfile")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {DEFAULT_ALLOCATIONS[opt.id].stocks}/{DEFAULT_ALLOCATIONS[opt.id].bonds}/{DEFAULT_ALLOCATIONS[opt.id].cash}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">Add client</Button>
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
