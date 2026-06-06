import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   // Role-restricted:
 *   <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
 *     <Route path="/admin" element={<AdminPanel />} />
 *   </Route>
 */
import { Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <span>Verifying session…</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, preserving where the user wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
