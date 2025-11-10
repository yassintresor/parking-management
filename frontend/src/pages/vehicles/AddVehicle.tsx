import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    license_plate: '',
    make: '',
    model: '',
    color: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.license_plate || !formData.make || !formData.model) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/vehicles', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // if (response.ok) {
      //   navigate('/vehicles');
      // } else {
      //   setError('Failed to add vehicle');
      // }
      
      // For now, just navigate to vehicles
      console.log('Vehicle data:', formData);
      navigate('/vehicles');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setError('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Vehicle</h1>
        <p className="text-gray-600">Register a new vehicle for parking bookings</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>Enter the details of your vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate *</Label>
              <Input
                id="license_plate"
                name="license_plate"
                placeholder="ABC123"
                value={formData.license_plate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  name="make"
                  placeholder="Toyota"
                  value={formData.make}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Camry"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                placeholder="Blue"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => navigate('/vehicles')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}