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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to={user ? (user.role === "ADMIN" ? "/admin" : user.role === "OPERATOR" ? "/employee" : "/dashboard") : "/"} 
            className="flex items-center gap-2 font-bold text-xl transition-transform hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="gradient-text-animated">ParkEase</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all shadow-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" onClick={handleHomeClick}>
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className={`transition-all duration-300 ${
                  isActive("/") 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                Home
              </Button>
            </Link>
            <Link to={user ? "/spaces/available" : "/spaces/available/public"}>
              <Button 
                variant={isActive("/spaces/available") || isActive("/spaces/available/public") ? "default" : "ghost"}
                size="sm"
                className={`transition-all duration-300 ${
                  isActive("/spaces/available") || isActive("/spaces/available/public") 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                Parking
              </Button>
            </Link>
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="hover:bg-red-100 hover:text-red-600 transition-all hover:shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideInDown bg-white rounded-b-xl shadow-lg">
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
                  className={`w-full justify-start transition-all ${
                    isActive("/") 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : ""
                  }`}
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
                  className={`w-full justify-start transition-all ${
                    isActive("/spaces/available") || isActive("/spaces/available/public") 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : ""
                  }`}
                >
                  Available Parking
                </Button>
              </Link>
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-red-100 hover:text-red-600"
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
                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
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