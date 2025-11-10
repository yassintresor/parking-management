import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../hooks/useAuth';

interface Vehicle {
  id: number;
  user_id: number;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  created_at: string;
}

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/vehicles/user/' + user?.id);
      // const data = await response.json();
      // setVehicles(data);
      
      // Mock data for now
      setVehicles([
        {
          id: 1,
          user_id: 1,
          license_plate: 'ABC123',
          make: 'Toyota',
          model: 'Camry',
          color: 'Blue',
          created_at: '2025-11-05T11:05:17.000Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVehicle = (vehicleId: number) => {
    console.log('Deleting vehicle:', vehicleId);
    // In a real implementation, this would call your backend API
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Vehicles</h1>
            <p className="text-gray-600">Manage your registered vehicles</p>
          </div>
          <Button onClick={() => console.log('Add new vehicle')}>
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No vehicles found.</p>
          <Button className="mt-4" onClick={() => console.log('Add new vehicle')}>
            Add Your First Vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{vehicle.license_plate}</CardTitle>
                    <CardDescription>{vehicle.make} {vehicle.model}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Color:</span>
                    <span>{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Added:</span>
                    <span>{formatDate(vehicle.created_at)}</span>
                  </div>
                  <div className="pt-4 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => console.log('Edit vehicle', vehicle.id)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteVehicle(vehicle.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}