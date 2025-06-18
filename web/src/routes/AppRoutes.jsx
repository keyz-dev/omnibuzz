// routes/AppRoutes.jsx
import { Routes } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import { passengerRoutes } from "./PassengerRoutes";
import { agencyAdminRoutes } from "./AgencyAdminRoutes";
import { stationManagerRoutes } from "./StationManagerRoutes";
import { adminRoutes } from "./AdminRoutes";
import { useAuth } from "../stateManagement/contexts";
import { Loader } from "../components/ui";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

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
