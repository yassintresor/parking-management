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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">🏢 Admin Dashboard</h1>
          <p className="text-neutral-600 text-lg">Manage parking facilities and view comprehensive analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="modern-card border-l-4 border-l-blue-600 hover:border-l-blue-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-neutral-600 text-sm font-semibold uppercase tracking-wide">Total Spots</h3>
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-neutral-900 mb-2">{totalSpots}</div>
            <p className="text-xs text-neutral-600">Across all locations</p>
          </div>

          <div className="modern-card border-l-4 border-l-green-600 hover:border-l-green-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-neutral-600 text-sm font-semibold uppercase tracking-wide">Available</h3>
              <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{totalAvailable}</div>
            <p className="text-xs text-neutral-600">Currently free</p>
          </div>

          <div className="modern-card border-l-4 border-l-purple-600 hover:border-l-purple-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-neutral-600 text-sm font-semibold uppercase tracking-wide">Occupancy</h3>
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{occupancyRate}%</div>
            <p className="text-xs text-neutral-600">Current utilization</p>
          </div>

          <div className="modern-card border-l-4 border-l-amber-600 hover:border-l-amber-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-neutral-600 text-sm font-semibold uppercase tracking-wide">Revenue</h3>
              <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-amber-600 mb-2">${totalRevenue}</div>
            <p className="text-xs text-neutral-600">Estimated hourly</p>
          </div>
        </div>

        {/* Parking Spots Management */}
        <div className="modern-card border border-gray-200">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">🅿️ Parking Spots Management</h2>
                <p className="text-neutral-600 text-sm mt-1">Manage and monitor all parking facilities</p>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Spot
              </Button>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
              <h3 className="font-bold text-lg text-neutral-900 mb-5">➕ Add New Parking Spot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">Parking Name</Label>
                  <Input
                    id="name"
                    value={newSpot.name}
                    onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                    placeholder="e.g., Downtown Plaza"
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-neutral-700">Address</Label>
                  <Input
                    id="address"
                    value={newSpot.address}
                    onChange={(e) => setNewSpot({ ...newSpot, address: e.target.value })}
                    placeholder="e.g., 123 Main Street"
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSpots" className="text-sm font-semibold text-neutral-700">Total Spots</Label>
                  <Input
                    id="totalSpots"
                    type="number"
                    value={newSpot.totalSpots}
                    onChange={(e) => setNewSpot({ ...newSpot, totalSpots: e.target.value })}
                    placeholder="e.g., 50"
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour" className="text-sm font-semibold text-neutral-700">Price per Hour ($)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    step="0.5"
                    value={newSpot.pricePerHour}
                    onChange={(e) => setNewSpot({ ...newSpot, pricePerHour: e.target.value })}
                    placeholder="e.g., 5"
                    className="input-modern"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddSpot} 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg font-semibold"
                >
                  ✓ Add Spot
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  className="bg-gray-200 text-neutral-700 hover:bg-gray-300 font-semibold"
                >
                  ✕ Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Spots List */}
          <div className="space-y-4">
            {parkingSpots.map((spot) => (
              <div
                key={spot.id}
                className="modern-card border-l-4 border-l-blue-600 hover:border-l-blue-700 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-neutral-900">{spot.name}</h4>
                      <Badge className={spot.availableSpots > 0 ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gradient-to-r from-red-500 to-rose-600 text-white"}>
                        {spot.availableSpots > 0 ? "✓ Available" : "✕ Full"}
                      </Badge>
                    </div>
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