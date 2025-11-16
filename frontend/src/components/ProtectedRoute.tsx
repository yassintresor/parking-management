import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "employee";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simple timeout to ensure role checking completes
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Periodically check authentication status
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Re-check authentication status every 5 minutes
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Token was removed, redirect to login
        window.location.href = '/auth';
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Debug logging
  console.log("ProtectedRoute render:", { 
    user: !!user, 
    userRole, 
    requiredRole, 
    loading, 
    isChecking,
    shouldRender: !loading && !isChecking && user
  });

  // Show loading state while checking auth state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log("No user, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If specific role is required and doesn't match, redirect appropriately
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Access denied. Required role: ${requiredRole}, User role: ${userRole}`);
    
    // If user has a role, redirect to their dashboard
    if (userRole === "admin") {
      console.log("Redirecting to /admin");
      return <Navigate to="/admin" replace />;
    } else if (userRole === "employee") {
      console.log("Redirecting to /employee");
      return <Navigate to="/employee" replace />;
    } else if (userRole === "user") {
      console.log("Redirecting to /dashboard");
      return <Navigate to="/dashboard" replace />;
    }
    
    // If no role determined, redirect to login
    console.log("No role determined, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // If we get here, render the protected content
  console.log("Rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;