import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    // Special handling for auth routes
    if (path === "/auth/login" && (location.pathname === "/auth" || location.pathname === "/auth/login")) {
      return true;
    }
    return location.pathname === path;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    // If user is logged in, prevent default navigation and redirect to dashboard
    if (user) {
      e.preventDefault();
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "OPERATOR") {
        navigate("/employee");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to={user ? (user.role === "ADMIN" ? "/admin" : user.role === "OPERATOR" ? "/employee" : "/dashboard") : "/"} 
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Car className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">ParkEase</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" onClick={handleHomeClick}>
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
              >
                Home
              </Button>
            </Link>
            <Link to={user ? "/spaces/available" : "/spaces/available/public"}>
              <Button 
                variant={isActive("/spaces/available") || isActive("/spaces/available/public") ? "default" : "ghost"}
                size="sm"
              >
                Available Parking
              </Button>
            </Link>
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="default"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={(e) => {
                  handleHomeClick(e);
                  setIsMenuOpen(false);
                }}
              >
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  Home
                </Button>
              </Link>
              <Link 
                to={user ? "/spaces/available" : "/spaces/available/public"}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button 
                  variant={isActive("/spaces/available") || isActive("/spaces/available/public") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  Available Parking
                </Button>
              </Link>
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    variant="default"
                    className="w-full justify-start"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;