import { Link } from "react-router";

export default function ActivityFeed({ clients }) {
  if (!clients.length) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No client activity yet.
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-gray-50">
      {clients.map((client) => (
        <li key={client.id} className="py-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={`/clients/${client.id}`}
              className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {client.name}
            </Link>
            <p className="text-xs text-gray-400 truncate">{client.lastActivity}</p>
          </div>
          <span className="text-xs text-gray-300 shrink-0">→</span>
        </li>
      ))}
    </ul>
  );
}
