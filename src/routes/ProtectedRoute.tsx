import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { store } from "../app/store";
console.log("store instance id:", store);

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
