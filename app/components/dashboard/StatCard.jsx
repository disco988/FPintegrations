export default function StatCard({ label, value, sub, trend, icon }) {
  const trendPositive = trend && trend > 0;
  const trendNegative = trend && trend < 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <div className="flex items-center gap-1.5 text-xs">
        {trend !== undefined && (
          <span
            className={`font-semibold ${
              trendPositive ? "text-green-600" : trendNegative ? "text-red-500" : "text-gray-400"
            }`}
          >
            {trendPositive ? "▲" : trendNegative ? "▼" : "—"}{" "}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-gray-400">{sub}</span>}
      </div>
    </div>
  );
}
