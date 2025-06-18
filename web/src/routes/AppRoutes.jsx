import { Routes } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import { passengerRoutes } from "./PassengerRoutes";
import { agencyAdminRoutes } from "./AgencyAdminRoutes";
import { stationManagerRoutes } from "./StationManagerRoutes";
import { adminRoutes } from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes}
      {passengerRoutes}
      {agencyAdminRoutes}
      {stationManagerRoutes}
      {adminRoutes}
    </Routes>
  );
};

export default AppRoutes;
