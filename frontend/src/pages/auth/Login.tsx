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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Already Signed In</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              You are already logged in. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
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
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to access your parking management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-center text-sm font-medium text-destructive">{error}</div>}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-sm">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;