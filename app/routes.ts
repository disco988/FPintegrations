import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/PublicLayout.jsx", [
    index("routes/home.jsx"),
    route("pricing", "routes/pricing.jsx"),
    route("login", "routes/login.jsx"),
    route("signup", "routes/signup.jsx"),
    route("forgot-password", "routes/forgot-password.jsx"),
    route("reset-password", "routes/reset-password.jsx"),
  ]),
  layout("layouts/AppLayout.jsx", [
    route("dashboard", "routes/dashboard.jsx"),
    route("account", "routes/account.jsx"),
    route("billing", "routes/billing.jsx"),
    route("checkout", "routes/checkout.jsx"),
    route("checkout/success", "routes/checkout.success.jsx"),
  ]),
] satisfies RouteConfig;
