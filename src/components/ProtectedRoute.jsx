// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && Number(user.id_rol) !== Number(role)) {
    // Redirige a home si el rol no coincide
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
