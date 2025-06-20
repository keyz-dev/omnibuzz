import React from 'react';
import { useAuth } from './AuthContext';
import { AdminProvider, BaseDashboardProvider, StationManagerProvider, AADProvider } from './dashboard';
import { USER_ROLES } from '../../config/userRoles';
import { Loader } from '../../components/ui';

const DashboardContextWrapper = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  const getContextProvider = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return AdminProvider;
      case USER_ROLES.AGENCY_ADMIN:
        return AADProvider;
      case USER_ROLES.STATION_MANAGER:
        return StationManagerProvider;
      default:
        return React.Fragment;
    }
  };

  const ContextProvider = getContextProvider();

  return (
    <BaseDashboardProvider>
      <ContextProvider>
        {children}
      </ContextProvider>
    </BaseDashboardProvider>
  );
};

export default DashboardContextWrapper;