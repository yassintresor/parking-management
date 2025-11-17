import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { Shield, RefreshCw, LogOut } from 'lucide-react';

interface OccupancyData {
  type: string;
  total_spaces: number;
  available_spaces: string;
  occupied_spaces: string;
  reserved_spaces: string;
  occupancy_rate: string;
}

interface RevenueData {
  date: string;
  total_revenue: string;
  total_payments: number;
}

export default function AnalyticsDashboard() {
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // In a real implementation, these would call your backend APIs
      // const occupancyResponse = await fetch('/api/analytics/occupancy');
      // const occupancyData = await occupancyResponse.json();
      // setOccupancyData(occupancyData);
      
      // const revenueResponse = await fetch('/api/analytics/revenue');
      // const revenueData = await revenueResponse.json();
      // setRevenueData(revenueData);
      
      // Mock data for now
      setOccupancyData([
        {
          type: 'COMPACT',
          total_spaces: 10,
          available_spaces: '5',
          occupied_spaces: '3',
          reserved_spaces: '2',
          occupancy_rate: '50.00'
        },
        {
          type: 'LARGE',
          total_spaces: 5,
          available_spaces: '2',
          occupied_spaces: '2',
          reserved_spaces: '1',
          occupancy_rate: '60.00'
        }
      ]);
      
      setRevenueData([
        {
          date: '2025-11-05',
          total_revenue: '150.00',
          total_payments: 5
        },
        {
          date: '2025-11-04',
          total_revenue: '120.00',
          total_payments: 4
        }
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (userRole !== 'admin' && userRole !== 'employee') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="modern-card border-l-4 border-l-red-600 max-w-md text-center p-8">
          <div className="inline-block p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-full mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h1>
          <p className="text-neutral-600">You don't have permission to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">📊 Analytics Dashboard</h1>
          <p className="text-neutral-600 mt-2">View comprehensive parking system analytics and reports</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-neutral-600 font-semibold">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Occupancy Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">📍 Occupancy Overview</h2>
                  <p className="text-neutral-600 text-sm mt-1">Real-time parking space occupancy statistics</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={fetchAnalyticsData}
                  className="border-2 border-blue-300 hover:bg-blue-50 font-semibold"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {occupancyData.map((data, index) => (
                  <div key={index} className="modern-card border-t-4 border-t-blue-600">
                    <div className="mb-4">
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
                        {data.type} Spaces
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">Total: {data.total_spaces} spaces</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                        <span className="text-neutral-700 font-medium">✅ Available</span>
                        <span className="text-2xl font-bold text-green-600">{data.available_spaces}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                        <span className="text-neutral-700 font-medium">🚗 Occupied</span>
                        <span className="text-2xl font-bold text-red-600">{data.occupied_spaces}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                        <span className="text-neutral-700 font-medium">⏱️ Reserved</span>
                        <span className="text-2xl font-bold text-amber-600">{data.reserved_spaces}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-neutral-700 font-semibold">Occupancy Rate</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {data.occupancy_rate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              parseFloat(data.occupancy_rate) > 80 ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                              parseFloat(data.occupancy_rate) > 50 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                              'bg-gradient-to-r from-green-500 to-emerald-600'
                            }`}
                            style={{ width: `${data.occupancy_rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Section */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">💰 Revenue Trends</h2>
              <p className="text-neutral-600 text-sm mb-6">Daily revenue statistics and payment history</p>
              <div className="modern-card border-l-4 border-l-green-600">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-neutral-900">Date</th>
                        <th className="text-center py-4 px-4 font-bold text-neutral-900">Total Revenue</th>
                        <th className="text-center py-4 px-4 font-bold text-neutral-900">Transactions</th>
                        <th className="text-center py-4 px-4 font-bold text-neutral-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-semibold text-neutral-900">{formatDate(data.date)}</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              RWF {data.total_revenue}
                            </span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                              {data.total_payments} transactions
                            </span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm font-semibold">
                              ✅ Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}