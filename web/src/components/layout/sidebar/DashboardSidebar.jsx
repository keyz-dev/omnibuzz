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

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {roleConfig.navItems.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.Circle;
          const fullPath = item.path ? `${roleConfig.basePath}/${item.path}` : roleConfig.basePath;
          
          return (
            <Link
              key={item.path}
              to={fullPath}
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-accent border-r-4 border-accent' 
                    : 'text-gray-600 hover:bg-gray-50'
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
