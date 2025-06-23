import React from "react";
import {
  AgencyRouteProvider,
  AgencyStationProvider,
  AgencyBusProvider,
  AgencyStaffProvider,
  AgencyProvider,
} from "./";

const AgencyContextWrapper = ({ children }) => {
  return (
    <AgencyProvider>
      <AgencyRouteProvider>
        <AgencyStationProvider>
          <AgencyBusProvider>
            <AgencyStaffProvider>{children}</AgencyStaffProvider>
          </AgencyBusProvider>
        </AgencyStationProvider>
      </AgencyRouteProvider>
    </AgencyProvider>
  );
};

export default AgencyContextWrapper;
