import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-[100dvh] place-items-center bg-neutral-950 text-neutral-400">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
