import { useNavigate } from "react-router";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "../ui/Table";
import Badge from "../ui/Badge";
import { RISK_LABELS, RISK_COLORS } from "../../data/mockClients";

function formatValue(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function AllocationBar({ allocation }) {
  const { stocks = 0, bonds = 0, cash = 0 } = allocation;
  return (
    <div className="flex rounded-full overflow-hidden h-2 w-24 gap-px">
      <div style={{ width: `${stocks}%` }} className="bg-indigo-500" title={`Stocks ${stocks}%`} />
      <div style={{ width: `${bonds}%` }}  className="bg-sky-400"   title={`Bonds ${bonds}%`} />
      <div style={{ width: `${cash}%` }}   className="bg-slate-300"  title={`Cash ${cash}%`} />
    </div>
  );
}

export default function ClientTable({ clients }) {
  const navigate = useNavigate();

  if (!clients.length) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No clients yet. Add your first client to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <Th>Client</Th>
          <Th>Portfolio value</Th>
          <Th>Risk profile</Th>
          <Th>Allocation</Th>
          <Th>Last activity</Th>
        </TableRow>
      </TableHead>
      <TableBody>
        {clients.map((client) => (
          <TableRow
            key={client.id}
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-400">{client.email}</p>
                </div>
              </div>
            </Td>
            <Td>
              <span className="font-semibold text-gray-900">
                {formatValue(client.portfolioValue)}
              </span>
            </Td>
            <Td>
              <Badge variant={RISK_COLORS[client.riskProfile]}>
                {RISK_LABELS[client.riskProfile]}
              </Badge>
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <AllocationBar allocation={client.allocation} />
                <span className="text-xs text-gray-400">
                  {client.allocation.stocks}/{client.allocation.bonds}/{client.allocation.cash}
                </span>
              </div>
            </Td>
            <Td>
              <span className="text-gray-500 text-xs">{client.lastActivity}</span>
            </Td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
