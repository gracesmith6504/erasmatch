
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" />;
  }
  
  return children;
};

export default ProtectedRoute;
