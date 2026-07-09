// 12 monthly data points — each is { month, value }
function months(base, deltas) {
  const labels = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  let value = base;
  return labels.map((month, i) => {
    value = Math.round(value * (1 + deltas[i] / 100));
    return { month, value };
  });
}

export const MOCK_CLIENTS = [
  {
    id: "c1",
    name: "James Whitfield",
    portfolioValue: 485000,
    riskProfile: "aggressive",
    allocation: { stocks: 80, bonds: 12, cash: 8 },
    history: months(430000, [2.1, -1.4, 3.5, -2.0, 4.2, 1.8, -0.9, 3.1, 2.5, -1.2, 3.8, 2.0]),
    lastActivity: "Rebalanced to 80/12/8 allocation",
    email: "j.whitfield@email.com",
    joinedAt: "2023-02-14",
  },
  {
    id: "c2",
    name: "Patricia Nguyen",
    portfolioValue: 245000,
    riskProfile: "balanced",
    allocation: { stocks: 60, bonds: 30, cash: 10 },
    history: months(215000, [1.4, 0.8, 2.1, -0.6, 1.9, 1.2, 0.5, 1.8, 1.4, -0.3, 2.2, 1.1]),
    lastActivity: "Portfolio +2.3% this week",
    email: "p.nguyen@email.com",
    joinedAt: "2023-06-01",
  },
  {
    id: "c3",
    name: "Robert Chen",
    portfolioValue: 128000,
    riskProfile: "conservative",
    allocation: { stocks: 30, bonds: 55, cash: 15 },
    history: months(118000, [0.7, 0.4, 0.9, -0.2, 0.8, 0.6, 0.3, 0.7, 0.9, 0.1, 0.8, 0.5]),
    lastActivity: "Added $5,000 to bond allocation",
    email: "r.chen@email.com",
    joinedAt: "2023-08-20",
  },
  {
    id: "c4",
    name: "Sandra Okafor",
    portfolioValue: 672000,
    riskProfile: "balanced",
    allocation: { stocks: 55, bonds: 35, cash: 10 },
    history: months(590000, [1.8, 1.2, 2.4, -0.8, 2.0, 1.5, 0.9, 2.1, 1.7, -0.4, 2.5, 1.3]),
    lastActivity: "Quarterly review completed",
    email: "s.okafor@email.com",
    joinedAt: "2022-11-03",
  },
  {
    id: "c5",
    name: "Thomas Brennan",
    portfolioValue: 310000,
    riskProfile: "aggressive",
    allocation: { stocks: 75, bonds: 15, cash: 10 },
    history: months(265000, [3.2, -2.1, 4.8, -3.5, 5.1, 2.3, -1.4, 4.0, 3.1, -1.8, 5.2, 2.7]),
    lastActivity: "Increased equity exposure by 5%",
    email: "t.brennan@email.com",
    joinedAt: "2024-01-09",
  },
  {
    id: "c6",
    name: "Helen Morales",
    portfolioValue: 89000,
    riskProfile: "conservative",
    allocation: { stocks: 25, bonds: 60, cash: 15 },
    history: months(82000, [0.5, 0.3, 0.8, -0.1, 0.7, 0.4, 0.2, 0.6, 0.8, 0.0, 0.7, 0.4]),
    lastActivity: "Reviewed retirement timeline",
    email: "h.morales@email.com",
    joinedAt: "2024-03-18",
  },
];

export const RISK_LABELS = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Aggressive",
};

export const RISK_COLORS = {
  conservative: "blue",
  balanced:     "indigo",
  aggressive:   "yellow",
};
