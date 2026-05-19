import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardIcon, LeadsIcon } from '../components/Icons';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { name: 'Leads', path: '/leads', icon: <LeadsIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className={`w-[260px] h-screen bg-bg-sidebar border-r border-border flex flex-col p-6 fixed left-0 top-0 text-text-main z-50 transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-lg">Mini CRM</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-bg-subtle text-text-subtle cursor-pointer transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
 
      <nav className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => 
              `flex items-center gap-3 p-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-text-subtle hover:bg-bg-subtle'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
 
      <div className="pt-5 border-t border-border mt-5">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-sm font-semibold text-text-subtle">
            {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold overflow-hidden text-ellipsis white-space-nowrap">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-text-subtle overflow-hidden text-ellipsis white-space-nowrap">
              {user?.email}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left p-2 text-sm text-red-600 bg-transparent mt-2 font-medium hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
