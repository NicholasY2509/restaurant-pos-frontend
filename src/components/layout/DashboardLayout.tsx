import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useTenant } from '../../contexts/TenantContext';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tenant } = useTenant();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {tenant ? tenant.name : 'Restaurant POS'}
              </h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 