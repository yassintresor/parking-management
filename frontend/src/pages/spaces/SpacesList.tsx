import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../hooks/useAuth';

interface ParkingSpace {
  id: number;
  space_number: string;
  location: string;
  type: string;
  status: string;
  hourly_rate: string;
  created_at: string;
}

export default function SpacesList() {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useAuth();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/spaces');
      // const data = await response.json();
      // setSpaces(data);
      
      // Mock data for now
      setSpaces([
        {
          id: 1,
          space_number: 'A1',
          location: 'Entrance A',
          type: 'COMPACT',
          status: 'AVAILABLE',
          hourly_rate: '2.50',
          created_at: '2025-11-05T11:04:34.000Z'
        },
        {
          id: 2,
          space_number: 'A2',
          location: 'Entrance A',
          type: 'LARGE',
          status: 'RESERVED',
          hourly_rate: '3.50',
          created_at: '2025-11-05T11:04:34.000Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching spaces:', error);
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Parking Spaces</h1>
            <p className="text-gray-600">Manage and view all parking spaces</p>
          </div>
          {userRole === 'admin' && (
            <Button onClick={() => console.log('Add new space')}>
              Add New Space
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search spaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    space.status === 'AVAILABLE' 
                      ? 'bg-green-100 text-green-800' 
                      : space.status === 'RESERVED' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
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
                    <span>${space.hourly_rate}</span>
                  </div>
                  {userRole === 'admin' && (
                    <div className="pt-4 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => console.log('Edit space', space.id)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => console.log('Delete space', space.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}