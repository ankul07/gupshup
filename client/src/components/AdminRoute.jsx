import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // Redirect back to the page the user came from (or home if unknown)
    const from = location.state?.from || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default AdminRoute;
