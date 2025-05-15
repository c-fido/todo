import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

export default function AuthGuard({
  children,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
