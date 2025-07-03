import React from 'react';
import { useAuth } from '../AuthContext';
import { BaseDashboardProvider } from '../dashboard/BaseDashboardContext';
import { AgencyContextWrapper, ManagerContextWrapper, AdminContextWrapper  } from './';
import { USER_ROLES } from '../../config/userRoles';
import { Loader } from '../../components/ui';

const DashboardContextWrapper = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  const getContextProvider = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return AdminContextWrapper;
      case USER_ROLES.AGENCY_ADMIN:
        return AgencyContextWrapper;
      case USER_ROLES.STATION_MANAGER:
        return ManagerContextWrapper;
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