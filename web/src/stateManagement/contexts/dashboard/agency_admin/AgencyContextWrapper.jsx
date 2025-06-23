import React from "react";
import {
    AgencyRouteProvider,
    AgencyStationProvider,
    AgencyBusProvider,
    AgencyProvider,
} from "./";

const AgencyContextWrapper = ({ children }) => {
    return (
        <AgencyProvider>
            <AgencyRouteProvider>
                <AgencyStationProvider>
                    <AgencyBusProvider>
                        {children}
                    </AgencyBusProvider>
                </AgencyStationProvider>
            </AgencyRouteProvider>
        </AgencyProvider>
    );
};

export default AgencyContextWrapper;
