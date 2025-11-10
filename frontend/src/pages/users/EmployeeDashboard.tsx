import { useState, useEffect } from "react";
import { 
  Car, 
  MapPin, 
  Plus, 
  Minus, 
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const EmployeeDashboard = () => {
  const { user, signOut } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              {parkingSpots.filter(spot => spot.status === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Car className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {parkingSpots.filter(spot => spot.status === 'OCCUPIED').length}
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
              {bookings.filter(booking => booking.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Spots Management */}
      <Card className="mb-6">
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
                  <Label htmlFor="spot">Select Parking Spot</Label>
                  <select
                    id="spot"
                    className="w-full p-2 border rounded"
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
                  <Label htmlFor="status">New Status</Label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded"
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
                      ${spot.hourly_rate}/hr
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

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 5).map(booking => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h4>
                    <Badge variant={
                      booking.status === 'ACTIVE' ? 'default' :
                      booking.status === 'COMPLETED' ? 'secondary' :
                      booking.status === 'CANCELLED' ? 'outline' : 'destructive'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Spot: {parkingSpots.find(s => s.id === booking.space_id)?.space_number || 'N/A'}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      Start: {new Date(booking.start_time).toLocaleString()}
                    </span>
                    {booking.end_time && (
                      <span className="text-muted-foreground">
                        End: {new Date(booking.end_time).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No bookings found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;