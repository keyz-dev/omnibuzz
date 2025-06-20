import React, { createContext, useContext, useState} from 'react';
import { useAuth } from '../AuthContext';
import { ROLE_CONFIGS } from '../../../config/userRoles';

const BaseDashboardContext = createContext();

export const useBaseDashboard = () => {
  const context = useContext(BaseDashboardContext);
  if (!context) {
    throw new Error('useBaseDashboard must be used within BaseDashboardProvider');
  }
  return context;
};

// This handles only UI-related dashboard state
export const BaseDashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const roleConfig = ROLE_CONFIGS[user?.role];

  const updateActiveNavFromPath = (currentPath) => {
    if (!roleConfig) return;
    
    const relativePath = currentPath.replace(roleConfig.basePath, '').replace(/^\//, '');
    const navItem = roleConfig.navItems.find(item => item.path === relativePath);
    
    if (navItem) {
      setActiveNavItem(relativePath);
      setPageTitle(navItem.label);
    }
  };

  const value = {
    user,
    roleConfig,
    activeNavItem,
    setActiveNavItem,
    sidebarCollapsed,
    setSidebarCollapsed,
    pageTitle,
    setPageTitle,
    updateActiveNavFromPath
  };

  return (
    <BaseDashboardContext.Provider value={value}>
      {children}
    </BaseDashboardContext.Provider>
  );
};