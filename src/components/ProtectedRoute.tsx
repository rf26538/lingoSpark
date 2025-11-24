import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface Props {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ requireAdmin = false }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.role !== "admin")
    return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
