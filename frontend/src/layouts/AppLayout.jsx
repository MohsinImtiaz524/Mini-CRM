import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-subtle">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content container */}
      <main className="flex-1 lg:ml-[260px] flex flex-col min-w-0 min-h-screen">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
