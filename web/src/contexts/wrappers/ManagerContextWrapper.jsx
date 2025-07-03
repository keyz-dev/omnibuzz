import React from "react";
import { StationManagerProvider } from "../dashboard/station_manager/StationManagerContext";
import { SchedulesProvider } from "../dashboard/station_manager/SchedulesContext";

const ManagerContextWrapper = ({ children }) => {
  return (
    <StationManagerProvider>
      <SchedulesProvider>{children}</SchedulesProvider>
    </StationManagerProvider>
  );
};

export default ManagerContextWrapper;
