import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/PublicLayout.jsx", [
    index("pages/LandingPage.jsx"),
    route("pricing", "pages/PricingPage.jsx"),
    route("docs", "pages/DocsPage.jsx"),
  ]),
  layout("layouts/AuthLayout.jsx", [
    route("login", "pages/LoginPage.jsx"),
    route("signup", "pages/SignupPage.jsx"),
    route("forgot-password", "pages/ForgotPasswordPage.jsx"),
    route("reset-password/:token", "pages/ResetPasswordPage.jsx"),
  ]),
  route("", "routes/ProtectedRoute.jsx", [
    layout("layouts/DashboardLayout.jsx", [
      route("dashboard", "pages/DashboardPage.jsx"),
      route("clients", "pages/ClientsPage.jsx"),
      route("clients/:clientId", "pages/ClientDetailPage.jsx"),
      route("portfolios/new", "pages/NewPortfolioPage.jsx"),
      route("reports", "pages/ReportsPage.jsx"),
      route("settings", "pages/SettingsPage.jsx"),
      route("billing", "pages/BillingPage.jsx"),
    ]),
  ]),
  route("*", "pages/NotFoundPage.jsx"),
] satisfies RouteConfig;
