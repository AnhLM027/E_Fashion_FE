import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/config/routes";

interface RequireRoleProps {
  allowedRoles: string[];
}
 
const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const { user, isLoading } = useAuth();
 
  if (isLoading) return null;
 
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
 
  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
 
  return <Outlet />;
};
 
export default RequireRole;
