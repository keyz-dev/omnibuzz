import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useBaseDashboard } from '../../stateManagement/contexts/dashboard';
import DashboardSidebar from './sidebar/DashboardSidebar';
import DashboardHeader from './header/DashboardHeader';

const DashboardLayout = () => {
  const { user, roleConfig, updateActiveNavFromPath } = useBaseDashboard();
  const location = useLocation();

  useEffect(() => {
    updateActiveNavFromPath(location.pathname);
  }, [location.pathname, updateActiveNavFromPath]);

  if (!user || !roleConfig) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;