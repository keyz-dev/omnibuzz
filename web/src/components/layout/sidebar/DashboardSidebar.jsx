import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBaseDashboard } from '../../../stateManagement/contexts/dashboard';
import * as Icons from 'lucide-react';

const DashboardSidebar = () => {
  const { roleConfig, sidebarCollapsed, user } = useBaseDashboard();
  const location = useLocation();

  if (!roleConfig) return null;

  const isActive = (path) => {
    const fullPath = path ? `${roleConfig.basePath}/${path}` : roleConfig.basePath;
    return location.pathname === fullPath;
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo/Brand */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Icons.Bus className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-xl text-gray-800">OmniBuzz</span>
          )}
        </div>
      </div>

      {/* User Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{roleConfig.displayName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {roleConfig.navItems.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.Circle;
          const fullPath = item.path ? `${roleConfig.basePath}/${item.path}` : roleConfig.basePath;
          
          return (
            <Link
              key={item.path}
              to={fullPath}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
