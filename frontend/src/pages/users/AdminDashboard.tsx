import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { ParkingSpot } from "@/components/ParkingSpotCard";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([
    {
      id: "1",
      name: "Downtown Plaza",
      address: "123 Main Street, Downtown",
      totalSpots: 50,
      availableSpots: 12,
      pricePerHour: 5
    },
    {
      id: "2",
      name: "Central Station Parking",
      address: "456 Railway Avenue, Central",
      totalSpots: 100,
      availableSpots: 45,
      pricePerHour: 4
    },
    {
      id: "3",
      name: "Riverside Mall",
      address: "789 River Road, Eastside",
      totalSpots: 200,
      availableSpots: 0,
      pricePerHour: 3
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: "",
    address: "",
    totalSpots: "",
    pricePerHour: ""
  });

  const totalSpots = parkingSpots.reduce((sum, spot) => sum + spot.totalSpots, 0);
  const totalAvailable = parkingSpots.reduce((sum, spot) => sum + spot.availableSpots, 0);
  const totalRevenue = parkingSpots.reduce(
    (sum, spot) => sum + (spot.totalSpots - spot.availableSpots) * spot.pricePerHour, 
    0
  );
  const occupancyRate = ((totalSpots - totalAvailable) / totalSpots * 100).toFixed(1);

  const handleAddSpot = () => {
    if (!newSpot.name || !newSpot.address || !newSpot.totalSpots || !newSpot.pricePerHour) {
      toast.error("Please fill in all fields");
      return;
    }

    const spot: ParkingSpot = {
      id: Date.now().toString(),
      name: newSpot.name,
      address: newSpot.address,
      totalSpots: parseInt(newSpot.totalSpots),
      availableSpots: parseInt(newSpot.totalSpots),
      pricePerHour: parseFloat(newSpot.pricePerHour)
    };

    setParkingSpots([...parkingSpots, spot]);
    setNewSpot({ name: "", address: "", totalSpots: "", pricePerHour: "" });
    setShowAddForm(false);
    toast.success("Parking spot added successfully!");
  };

  const handleDeleteSpot = (id: string) => {
    setParkingSpots(parkingSpots.filter(spot => spot.id !== id));
    toast.success("Parking spot deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage parking spots and view analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpots}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all locations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <MapPin className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalAvailable}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently free
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Current utilization
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Today)</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated hourly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Parking Spots Management */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Parking Spots Management</CardTitle>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                variant="accent"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Spot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="mb-6 p-4 border rounded-lg bg-card">
                <h3 className="font-semibold mb-4">Add New Parking Spot</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="name">Parking Name</Label>
                    <Input
                      id="name"
                      value={newSpot.name}
                      onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                      placeholder="e.g., Downtown Plaza"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newSpot.address}
                      onChange={(e) => setNewSpot({ ...newSpot, address: e.target.value })}
                      placeholder="e.g., 123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalSpots">Total Spots</Label>
                    <Input
                      id="totalSpots"
                      type="number"
                      value={newSpot.totalSpots}
                      onChange={(e) => setNewSpot({ ...newSpot, totalSpots: e.target.value })}
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      step="0.5"
                      value={newSpot.pricePerHour}
                      onChange={(e) => setNewSpot({ ...newSpot, pricePerHour: e.target.value })}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleAddSpot} variant="success" className="w-full sm:w-auto">
                    Add Spot
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {parkingSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{spot.name}</h4>
                      <Badge variant={spot.availableSpots > 0 ? "default" : "secondary"}>
                        {spot.availableSpots > 0 ? "Available" : "Full"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {spot.address}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-medium text-foreground">{spot.availableSpots}</span> / {spot.totalSpots} spots
                      </span>
                      <span className="text-accent font-medium">
                        ${spot.pricePerHour}/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
    </div>
  );
};

export default AdminDashboard;