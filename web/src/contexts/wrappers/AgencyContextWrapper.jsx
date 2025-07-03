import React from "react";
import {
  AgencyRouteProvider,
  AgencyStationCreationProvider,
  AgencyBusProvider,
  AgencyStaffProvider,
  AgencyProvider,
  StationCreationProvider
} from "../dashboard/agency_admin";

const AgencyContextWrapper = ({ children }) => {
  return (
    <StationCreationProvider>
      <AgencyProvider>
        <AgencyRouteProvider>
          <AgencyStationCreationProvider>
            <AgencyBusProvider>
              <AgencyStaffProvider>
                {children}
              </AgencyStaffProvider>
            </AgencyBusProvider>
          </AgencyStationCreationProvider>
        </AgencyRouteProvider>
      </AgencyProvider>
    </StationCreationProvider>
  );
};

export default AgencyContextWrapper;
