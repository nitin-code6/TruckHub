import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute
 * @param {Array} allowedRoles - roles allowed to access the route
 *
 * Usage:
 * <ProtectedRoute allowedRoles={["WAREHOUSE"]} />
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // 1️⃣ Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Logged in but role not allowed
  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Access granted
  return <Outlet />;
};

export default ProtectedRoute;
