import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/leads') return 'Leads Manager';
    return '';
  };

  return (
    <header className="h-16 bg-bg-header border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 text-text-main">
      <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="bg-bg-subtle border border-border rounded-lg w-9 h-9 flex items-center justify-center text-lg cursor-pointer transition-all duration-200 text-text-main"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="text-sm text-text-subtle">
          Welcome back, <span className="text-text-main font-medium">{user?.username || user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
