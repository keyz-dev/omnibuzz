import { useState } from "react";
import { useAuth } from "../../../stateManagement/contexts/AuthContext";
import { AADProvider } from "../../../stateManagement/contexts/dashboard";

const AgencyDashboard = () => {
  return (
    <AADProvider>
      <AADLayout />
    </AADProvider>
  );
};

export default AgencyDashboard;
