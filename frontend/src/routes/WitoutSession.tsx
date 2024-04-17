import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function SinSession({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();
  // auth.validateSession();

  return auth.isCompletedBasicInfo ? navigate('/welcome') : <Outlet />;
}