import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { spacesApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface ParkingSpace {
  id: number;
  space_number: string;
  location: string;
  type: string;
  status: string;
  hourly_rate: string;
  created_at: string;
}

export default function AvailableSpaces() {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableSpaces();
  }, []);

  const fetchAvailableSpaces = async () => {
    try {
      const response = await spacesApi.getAvailable();
      if (response.success) {
        setSpaces(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch available spaces');
      }
    } catch (error) {
      console.error('Error fetching available spaces:', error);
      toast.error('Error fetching available spaces');
    } finally {
      setLoading(false);
    }
  };

  const filteredSpaces = spaces.filter(space =>
    space.space_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Parking Spaces</h1>
          <p className="text-gray-600">Find available parking spaces</p>
          <p className="text-lg mt-2">
            Showing {spaces.length} available parking lots
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search available spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading available parking spaces...</p>
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No spaces match your search criteria.' : 'No available parking spaces at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Space {space.space_number}</CardTitle>
                      <CardDescription>{space.location}</CardDescription>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {space.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span>{space.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hourly Rate:</span>
                      <span>{space.hourly_rate} RWF</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}