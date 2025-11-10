# Admin Dashboard with Sidebar - User Guide

## Overview
This guide explains how to access and use the new Admin Dashboard with Sidebar feature that has been implemented in the Parking Management System.

## Accessing the Admin Dashboard

1. **Login as Admin**
   - Navigate to the login page: http://localhost:8081/auth
   - Use the following credentials (created during database initialization):
     - Email: admin@example.com
     - Password: Admin123!

2. **Accessing the Dashboard**
   - After successful login, you will be automatically redirected to the Admin Dashboard
   - Alternatively, you can access it directly at: http://localhost:8081/admin

## Features of the New Admin Dashboard

### Sidebar Navigation
The new admin dashboard features a collapsible sidebar with the following navigation options:

- **Dashboard**: Main overview with statistics
- **Parking Spaces**: Manage parking spaces
- **Users**: Manage system users
- **Analytics**: View system analytics and reports
- **Settings**: System configuration options

### Main Dashboard Features
The dashboard includes:

1. **Statistics Cards**:
   - Total parking spots across all locations
   - Currently available spots
   - Occupancy rate percentage
   - Revenue estimation

2. **Parking Spots Management**:
   - View all parking locations
   - Add new parking spots
   - Edit existing spots
   - Delete parking spots

## Using the Sidebar

### Collapsing/Expanding
- Click the hamburger menu icon (☰) at the top left to toggle the sidebar
- On larger screens, the sidebar can be collapsed to save space
- On mobile devices, the sidebar becomes a slide-out menu

### Navigation
- Click on any menu item in the sidebar to navigate to that section
- The active section will be highlighted in the sidebar

## Managing Parking Spots

### Adding a New Spot
1. Click the "Add New Spot" button on the dashboard
2. Fill in the form with:
   - Parking Name
   - Address
   - Total number of spots
   - Price per hour
3. Click "Add Spot" to save

### Editing a Spot
1. Click the edit icon (✎) next to any parking spot
2. Modify the spot details
3. Save changes

### Deleting a Spot
1. Click the delete icon (🗑) next to any parking spot
2. Confirm deletion when prompted

## Technical Details

### Implementation
The new admin dashboard with sidebar is implemented using:
- React with TypeScript
- Shadcn UI components
- Custom sidebar implementation based on the SidebarProvider pattern
- Responsive design for both desktop and mobile devices

### File Structure
- Main component: `src/pages/users/AdminDashboardWithSidebar.tsx`
- Route configuration: `src/App.tsx`

### Dependencies
- lucide-react (for icons)
- @radix-ui/react-slot
- class-variance-authority
- tailwindcss

## Troubleshooting

### Login Issues
If you cannot log in:
1. Ensure the backend server is running on port 3000
2. Verify the database has been initialized with the admin user
3. Check that the credentials are correct:
   - Email: admin@example.com
   - Password: Admin123!

### Dashboard Not Loading
If the dashboard doesn't load properly:
1. Ensure both frontend (port 8081) and backend (port 3000) servers are running
2. Check the browser console for any error messages
3. Verify that all dependencies are installed by running `npm install` in the frontend directory

## Future Enhancements
Planned improvements for the admin dashboard:
- Real-time data updates
- Advanced filtering and sorting options
- Export functionality for reports
- User role management
- System configuration settings