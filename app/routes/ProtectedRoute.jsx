import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { FullPageSpinner } from "../components/ui/Spinner";

export default function ProtectedRoute() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;
  if (!currentUser) return <Navigate to="/login" replace />;

  return <Outlet />;
}
