import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/services/api";

// Define a backend-only user type
type BackendUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type UserRole = "admin" | "employee" | "user" | null;

interface AuthContextType {
  user: BackendUser | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, name: string, phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRole = async (token: string) => {
    try {
      const response = await authApi.verify(token);
      if (response.success && response.data.user.role) {
        // Map backend roles to frontend roles
        const roleMap: Record<string, UserRole> = {
          'ADMIN': 'admin',
          'OPERATOR': 'employee',
          'USER': 'user'
        };
        return roleMap[response.data.user.role.toUpperCase()] || 'user';
      }
      return 'user'; // Default to user role
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      return 'user'; // Default to user role on any error
    }
  };

  useEffect(() => {
    // Check for existing auth token on mount
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await authApi.verify(token);
          if (response.success && response.data.user) {
            const userData = response.data.user;
            setUser(userData);
            
            // Map backend roles to frontend roles
            const roleMap: Record<string, UserRole> = {
              'ADMIN': 'admin',
              'OPERATOR': 'employee',
              'USER': 'user'
            };
            const role = roleMap[userData.role.toUpperCase()] || 'user';
            setUserRole(role);
            console.log('Existing auth verified, user:', userData.email, 'role:', role);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('Error verifying existing auth:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkExistingAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      // Authenticate with backend API only
      const response = await authApi.login(email, password);
      console.log('Backend login response:', response);
      
      if (response.success && response.data.token) {
        // Store the JWT token
        localStorage.setItem('auth_token', response.data.token);
        
        // Set user data
        const userData = response.data.user;
        setUser(userData);

        // Map backend roles to frontend roles
        const roleMap: Record<string, UserRole> = {
          'ADMIN': 'admin',
          'OPERATOR': 'employee',
          'USER': 'user'
        };
        
        const backendRole = userData.role?.toUpperCase();
        const role = roleMap[backendRole] || 'user';
        console.log('User role mapped to:', role);
        
        // Set the user role in state
        setUserRole(role);

        // Redirect based on user role
        if (role === "admin") {
          console.log('Redirecting to admin dashboard');
          navigate("/admin");
        } else if (role === "employee") {
          console.log('Redirecting to employee dashboard');
          navigate("/employee");
        } else {
          console.log('Redirecting to user dashboard');
          navigate("/dashboard");
        }

        toast.success("Signed in successfully!");
        return { error: null };
      } else {
        console.error('Backend login failed:', response.message);
        toast.error(response.message || "Invalid credentials");
        return { error: response.message || "Login failed" };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || "Error during login");
      return { error: error.message || "Login error" };
    }
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Register with backend API only
      const response = await authApi.register({ email, password, name, phone });
      
      if (response.success) {
        toast.success("Account created successfully! Please sign in.");
        return { error: null };
      } else {
        toast.error(response.message || "Error creating account");
        return { error: response.message };
      }
    } catch (error: any) {
      toast.error(error.message || "Error during registration");
      return { error };
    }
  };

  const signOut = async () => {
    // Clear local storage token
    localStorage.removeItem('auth_token');
    setUser(null);
    setUserRole(null);
    toast.success("Signed out successfully!");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        signIn,
        register,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};