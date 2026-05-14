import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Trees, ShoppingBag, Wrench, Leaf, Users,
  UserCheck, LogOut, BarChart2, AlertCircle, PlusCircle, X
} from 'lucide-react';

const customerNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
  { icon: Trees, label: 'Browse Trees', path: '/customer/browse' },
  { icon: ShoppingBag, label: 'My Adoptions', path: '/customer/adoptions' },
];

const farmerNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer' },
  { icon: Trees, label: 'My Trees', path: '/farmer/trees' },
  { icon: PlusCircle, label: 'Add Tree', path: '/farmer/trees/add' },
  { icon: Wrench, label: 'Maintenance', path: '/farmer/maintenance' },
  { icon: Leaf, label: 'Harvest', path: '/farmer/harvest' },
];

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Trees, label: 'Manage Trees', path: '/admin/trees' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: UserCheck, label: 'Farmers', path: '/admin/farmers' },
  { icon: ShoppingBag, label: 'Adoptions', path: '/admin/adoptions' },
  { icon: AlertCircle, label: 'Disputes', path: '/admin/disputes' },
  { icon: BarChart2, label: 'Reports', path: '/admin/reports' },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'farmer' ? farmerNav : customerNav;

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const IMG_URL = 'http://localhost:5000/uploads/';

  return (
    <>
      {open && <div className="modal-overlay" style={{ zIndex: 99 }} onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span>🌳</span>
          <div>
            <h2>Rent-a-Tree</h2>
            <small>{user?.role} portal</small>
          </div>
          <button className="menu-btn" style={{ marginLeft: 'auto', display: 'none' }} onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => handleNav(path)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profile_image
                ? <img src={IMG_URL + user.profile_image} alt="" />
                : user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="user-details">
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
