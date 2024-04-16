import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  // auth.validateSession();

  return auth.isAuthenticated ? children ? children : <Outlet /> : (
      <p>You are not allowed here</p>
  );
}