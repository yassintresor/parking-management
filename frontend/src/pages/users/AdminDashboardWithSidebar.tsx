import { useState, useEffect } from "react";
import { 
  Home, 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  MapPin,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Calendar,
  UserCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { spacesApi, userApi, bookingsApi, paymentsApi, analyticsApi } from "@/services/api";

// Define types
interface ParkingSpot {
  id: string;
  space_number: string;
  location: string;
  type: string;
  status: string;
  hourly_rate: number;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
}

interface Booking {
  id: string;
  user_id: string;
  space_id: string;
  vehicle_id: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  created_at: string;
}

interface AnalyticsData {
  total_spaces: number;
  available_spaces: number;
  occupied_spaces: number;
  reserved_spaces: number;
  occupancy_rate: number;
  total_revenue: number;
  total_bookings: number;
  total_users: number;
}

const AdminDashboardWithSidebar = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showAddSpotForm, setShowAddSpotForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newSpot, setNewSpot] = useState({
    space_number: "",
    location: "",
    type: "COMPACT",
    hourly_rate: ""
  });
  
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "USER"
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      // Fetch all data in parallel
      const [spacesRes, usersRes, bookingsRes, paymentsRes, analyticsRes] = await Promise.all([
        spacesApi.getAll(token),
        userApi.getAll(token),
        bookingsApi.getAll(token),
        paymentsApi.getAll(token),
        analyticsApi.getDashboardData(token)
      ]);

      if (spacesRes.success) setParkingSpots(spacesRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpot = async () => {
    try {
      if (!newSpot.space_number || !newSpot.location || !newSpot.hourly_rate) {
        toast.error("Please fill in all required fields");
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      const response = await spacesApi.create({
        space_number: newSpot.space_number,
        location: newSpot.location,
        type: newSpot.type,
        hourly_rate: parseFloat(newSpot.hourly_rate)
      }, token);

      if (response.success) {
        toast.success("Parking spot added successfully!");
        setNewSpot({ space_number: "", location: "", type: "COMPACT", hourly_rate: "" });
        setShowAddSpotForm(false);
        fetchData(); // Refresh data
      } else {
        toast.error(response.message || "Failed to add parking spot");
      }
    } catch (err) {
      console.error("Error adding parking spot:", err);
      toast.error("Failed to add parking spot");
    }
  };

  const handleAddUser = async () => {
    try {
      console.log('Attempting to add user with data:', newUser);
      
      if (!newUser.email || !newUser.password || !newUser.name) {
        toast.error("Please fill in all required fields");
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      // Ensure role is in uppercase
      const userData = {
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role?.toUpperCase() || 'USER'
      };

      console.log('Sending user data:', userData);

      const response = await userApi.create(userData, token);

      console.log('User creation response:', response);
      
      if (response.success) {
        toast.success("User added successfully!");
        setNewUser({ email: "", password: "", name: "", phone: "", role: "USER" });
        setShowAddUserForm(false);
        fetchData(); // Refresh data
      } else {
        toast.error(response.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error("Failed to add user");
    }
  };

  const handleDeleteSpot = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      const response = await spacesApi.delete(id, token);

      if (response.success) {
        toast.success("Parking spot deleted successfully!");
        fetchData(); // Refresh data
      } else {
        toast.error(response.message || "Failed to delete parking spot");
      }
    } catch (err) {
      console.error("Error deleting parking spot:", err);
      toast.error("Failed to delete parking spot");
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parking Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_spaces ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{analytics?.available_spaces ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">RWF {analytics?.total_revenue ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {analytics && analytics.occupancy_rate !== undefined ? `${analytics.occupancy_rate.toFixed(1)}%` : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking #{String(booking.id).slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.start_time).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    booking.status === 'ACTIVE' ? 'default' :
                    booking.status === 'COMPLETED' ? 'secondary' : 'outline'
                  }>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map(payment => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.currency} {payment.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    payment.status === 'PAID' ? 'default' :
                    payment.status === 'PENDING' ? 'secondary' : 'outline'
                  }>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderParkingManagement = () => (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Parking Management</h1>
        <Button onClick={() => setShowAddSpotForm(!showAddSpotForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Spot
        </Button>
      </div>

      {showAddSpotForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Parking Spot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="space_number">Space Number *</Label>
                <Input
                  id="space_number"
                  value={newSpot.space_number}
                  onChange={(e) => setNewSpot({ ...newSpot, space_number: e.target.value })}
                  placeholder="e.g., A101"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newSpot.location}
                  onChange={(e) => setNewSpot({ ...newSpot, location: e.target.value })}
                  placeholder="e.g., Main Building Level 1"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded"
                  value={newSpot.type}
                  onChange={(e) => setNewSpot({ ...newSpot, type: e.target.value })}
                >
                  <option value="COMPACT">Compact</option>
                  <option value="LARGE">Large</option>
                  <option value="HANDICAP">Handicap</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </div>
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate (RWF) *</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={newSpot.hourly_rate}
                  onChange={(e) => setNewSpot({ ...newSpot, hourly_rate: e.target.value })}
                  placeholder="e.g., 5.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddSpot}>Add Spot</Button>
              <Button variant="outline" onClick={() => setShowAddSpotForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Parking Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parkingSpots.map(spot => (
              <div key={spot.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{spot.space_number}</h4>
                    <Badge variant={
                      spot.status === 'AVAILABLE' ? 'default' :
                      spot.status === 'OCCUPIED' ? 'destructive' :
                      spot.status === 'RESERVED' ? 'secondary' : 'outline'
                    }>
                      {spot.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{spot.location}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Type: <span className="font-medium text-foreground">{spot.type}</span>
                    </span>
                    <span className="text-accent font-medium">
                      RWF {spot.hourly_rate}/hr
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteSpot(spot.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setShowAddUserForm(!showAddUserForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {showAddUserForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g., user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="e.g., password123"
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="e.g., 123-456-7890"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border rounded"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Add User</Button>
              <Button variant="outline" onClick={() => setShowAddUserForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-semibold">{user.name}</h4>
                    <Badge variant={
                      user.role === 'ADMIN' ? 'default' :
                      user.role === 'OPERATOR' ? 'secondary' : 'outline'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Phone: {user.phone || 'N/A'}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_bookings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_users || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {analytics?.total_revenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occupancy Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Available</span>
                <span className="text-sm text-muted-foreground">
                  {analytics?.available_spaces || 0} of {analytics?.total_spaces || 0}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${((analytics?.available_spaces || 0) / (analytics?.total_spaces || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Occupied</span>
                <span className="text-sm text-muted-foreground">
                  {analytics?.occupied_spaces || 0} of {analytics?.total_spaces || 0}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${((analytics?.occupied_spaces || 0) / (analytics?.total_spaces || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Reserved</span>
                <span className="text-sm text-muted-foreground">
                  {analytics?.reserved_spaces || 0} of {analytics?.total_spaces || 0}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${((analytics?.reserved_spaces || 0) / (analytics?.total_spaces || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchData} className="mt-4">Retry</Button>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "parking":
        return renderParkingManagement();
      case "users":
        return renderUserManagement();
      case "analytics":
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl">
          <SidebarHeader className="border-b border-blue-700/50 bg-gradient-to-r from-blue-800/80 to-purple-800/80 backdrop-blur-sm p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="text-white hover:bg-white/10 rounded-xl transition-all duration-300 p-4">
                  <div className="flex flex-col gap-1 leading-none">
                    <span className="font-bold text-white text-lg">Parking Admin</span>
                    <span className="text-xs text-blue-200">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent className="py-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-300 font-bold text-sm mb-3 px-4">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("dashboard")}
                      isActive={activeSection === "dashboard"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "dashboard" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("parking")}
                      isActive={activeSection === "parking"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "parking" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Car className="h-5 w-5" />
                      <span>Parking Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("users")}
                      isActive={activeSection === "users"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "users" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("analytics")}
                      isActive={activeSection === "analytics"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "analytics" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-blue-700/50 bg-gradient-to-r from-red-700/80 to-orange-700/80 backdrop-blur-sm p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => signOut()}
                  className="text-blue-100 hover:bg-red-500/30 hover:text-white rounded-xl transition-all duration-300 p-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-gray-100 rounded-lg transition-colors" />
            <div className="font-semibold text-lg">Admin Dashboard</div>
          </header>
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboardWithSidebar;