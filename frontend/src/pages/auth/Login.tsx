import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is already logged in and on login page
    // This prevents the redirect loop and lets the auth hook handle the initial login redirect
    if (user && userRole && window.location.pathname === '/auth') {
      // This is just a fallback in case the user somehow ends up on the login page while already logged in
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "employee") {
        navigate("/employee");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, userRole, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Clear previous messages
    setError("");
    
    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);
    
    if (result.error) {
      setError(result.error);
    }
    
    // The redirect is handled in the useAuth hook's signIn function
  };

  // Prevent rendering the login form if user is already authenticated
  if (user && userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="modern-card w-full max-w-md border-blue-200">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Already Signed In</h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                You are already logged in. Redirecting to your dashboard...
              </p>
            </div>
            <Button 
              onClick={() => {
                if (userRole === "admin") {
                  navigate("/admin");
                } else if (userRole === "employee") {
                  navigate("/employee");
                } else {
                  navigate("/dashboard");
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="modern-card w-full max-w-md border-blue-200">
        <div className="text-center mb-6 space-y-3">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">Sign in to access your parking management dashboard</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg flex items-start">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="text-sm font-semibold text-neutral-700">Email Address</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="input-modern text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password" className="text-sm font-semibold text-neutral-700">Password</Label>
            <Input
              id="signin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="input-modern text-sm sm:text-base"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg font-semibold py-3 transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-neutral-600">Don't have an account?{" "}</span>
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;