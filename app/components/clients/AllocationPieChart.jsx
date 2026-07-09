import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  stocks: "#6366f1",
  bonds:  "#38bdf8",
  cash:   "#94a3b8",
};

const LABELS = {
  stocks: "Stocks",
  bonds:  "Bonds",
  cash:   "Cash",
};

export default function AllocationPieChart({ allocation }) {
  const data = Object.entries(allocation).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
    color: COLORS[key] || "#e2e8f0",
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, ""]}
          contentStyle={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
