import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type ProtectedRouteProps = {
  children: JSX.Element;
};

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-10 h-10 rounded-full border-4 border-erasmatch-green border-t-transparent animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();
  // Guard against the race between supabase.auth.signUp/signIn returning
  // and the AuthProvider's onAuthStateChange propagating isAuthenticated.
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(!!data.session);
      setSessionChecked(true);
    });
    return () => { active = false; };
  }, [location.pathname]);

  if (loading || !sessionChecked) return <Spinner />;

  if (!isAuthenticated && !hasSession) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
};

export default ProtectedRoute;
