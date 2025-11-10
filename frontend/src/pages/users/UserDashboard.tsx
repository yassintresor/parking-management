import React from 'react';
import { useAuth } from "@/hooks/useAuth";

const UserDashboard = () => {
  console.log("UserDashboard component rendering");
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.email}</p>
      </div>
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p>This is the user dashboard. You can manage your bookings, vehicles, and payments.</p>
        <button 
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
