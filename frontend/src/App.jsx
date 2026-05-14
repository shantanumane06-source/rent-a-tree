import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import BrowseTrees from './pages/customer/BrowseTrees';
import MyAdoptions from './pages/customer/MyAdoptions';
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerTrees from './pages/farmer/MyTrees';
import AddTree from './pages/farmer/AddTree';
import Maintenance from './pages/farmer/Maintenance';
import Harvest from './pages/farmer/Harvest';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTrees from './pages/admin/Trees';
import { AdminFarmers, AdminCustomers } from './pages/admin/Users';
import { AdminAdoptions, AdminDisputes } from './pages/admin/AdminPages';
import Reports from './pages/admin/Reports';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />

      {/* Customer */}
      <Route path="/customer" element={<PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>} />
      <Route path="/customer/browse" element={<PrivateRoute role="customer"><BrowseTrees /></PrivateRoute>} />
      <Route path="/customer/adoptions" element={<PrivateRoute role="customer"><MyAdoptions /></PrivateRoute>} />

      {/* Farmer */}
      <Route path="/farmer" element={<PrivateRoute role="farmer"><FarmerDashboard /></PrivateRoute>} />
      <Route path="/farmer/trees" element={<PrivateRoute role="farmer"><FarmerTrees /></PrivateRoute>} />
      <Route path="/farmer/trees/add" element={<PrivateRoute role="farmer"><AddTree /></PrivateRoute>} />
      <Route path="/farmer/maintenance" element={<PrivateRoute role="farmer"><Maintenance /></PrivateRoute>} />
      <Route path="/farmer/harvest" element={<PrivateRoute role="farmer"><Harvest /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/trees" element={<PrivateRoute role="admin"><AdminTrees /></PrivateRoute>} />
      <Route path="/admin/farmers" element={<PrivateRoute role="admin"><AdminFarmers /></PrivateRoute>} />
      <Route path="/admin/customers" element={<PrivateRoute role="admin"><AdminCustomers /></PrivateRoute>} />
      <Route path="/admin/adoptions" element={<PrivateRoute role="admin"><AdminAdoptions /></PrivateRoute>} />
      <Route path="/admin/disputes" element={<PrivateRoute role="admin"><AdminDisputes /></PrivateRoute>} />
      <Route path="/admin/reports" element={<PrivateRoute role="admin"><Reports /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'Nunito', fontWeight: 600, fontSize: '0.88rem' },
          success: { iconTheme: { primary: '#93C572', secondary: 'white' } }
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
