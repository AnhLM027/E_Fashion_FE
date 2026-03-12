import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/config/routes";

const RequireAdmin = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // console.log(user)
  if (user.role !== "ADMIN") {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
