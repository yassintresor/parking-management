import { useState, useEffect } from "react";
import { 
  Home, 
  Car, 
  MapPin, 
  BarChart3, 
  Settings, 
  LogOut,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
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
import { Badge } from "@/components/ui/badge";
import { spacesApi, bookingsApi } from "@/services/api";

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

const EmployeeDashboardWithSidebar = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [showUpdateStatusForm, setShowUpdateStatusForm] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("AVAILABLE");

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      // Fetch parking spaces and bookings in parallel
      const [spacesRes, bookingsRes] = await Promise.all([
        spacesApi.getAll(token),
        bookingsApi.getAll(token)
      ]);

      if (spacesRes.success) setParkingSpots(spacesRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleUpdateStatus = async () => {
    try {
      if (!selectedSpotId) {
        toast.error("No parking spot selected");
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');

      // In a real implementation, we would call an API to update the status
      // For now, we'll simulate the update
      toast.success(`Parking spot status updated to ${newStatus}`);
      setShowUpdateStatusForm(false);
      setSelectedSpotId(null);
      setNewStatus("AVAILABLE");
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error("Error updating parking spot status:", err);
      toast.error("Failed to update parking spot status");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'default';
      case 'OCCUPIED':
        return 'destructive';
      case 'RESERVED':
        return 'secondary';
      case 'OUT_OF_SERVICE':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'OCCUPIED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'RESERVED':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'OUT_OF_SERVICE':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-blue-100">Welcome, {user?.name || user?.email} 👋</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingSpots.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {parkingSpots.filter(s => s.status === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {parkingSpots.filter(s => s.status === 'OCCUPIED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {bookings.filter(b => b.status === 'ACTIVE').length}
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
            <CardTitle>Parking Spot Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parkingSpots.slice(0, 5).map(spot => (
                <div key={spot.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{spot.space_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {spot.location}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(spot.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(spot.status)}
                      {spot.status.replace('_', ' ')}
                    </div>
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
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Parking Spots Overview</CardTitle>
            <Button 
              onClick={() => setShowUpdateStatusForm(!showUpdateStatusForm)}
              variant="outline"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Spot Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showUpdateStatusForm && (
            <div className="mb-6 p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-4">Update Parking Spot Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="spot" className="block text-sm font-medium mb-1">Select Parking Spot</label>
                  <select
                    id="spot"
                    className="w-full p-2 border rounded bg-white"
                    value={selectedSpotId || ""}
                    onChange={(e) => setSelectedSpotId(e.target.value)}
                  >
                    <option value="">Select a spot</option>
                    {parkingSpots.map(spot => (
                      <option key={spot.id} value={spot.id}>
                        {spot.space_number} - {spot.location}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">New Status</label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded bg-white"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleUpdateStatus} className="w-full sm:w-auto">
                  Update Status
                </Button>
                <Button 
                  onClick={() => {
                    setShowUpdateStatusForm(false);
                    setSelectedSpotId(null);
                    setNewStatus("AVAILABLE");
                  }} 
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {parkingSpots.map(spot => (
              <div
                key={spot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{spot.space_number}</h4>
                    <Badge variant={getStatusBadgeVariant(spot.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(spot.status)}
                        {spot.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {spot.location}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Type: <span className="font-medium text-foreground">{spot.type}</span>
                    </span>
                    <span className="text-accent font-medium">
                      RWF {spot.hourly_rate}/hr
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
                    <span className="font-bold text-white text-lg">Parking Operator</span>
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
            <div className="font-semibold text-lg">Employee Dashboard</div>
          </header>
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboardWithSidebar;