import { Route } from "react-router-dom";
import { Layout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import {
  Dashboard as PassengerDashboard,
  Bookings as PassengerBookings,
  Profile as PassengerProfile,
  Search as PassengerSearch,
} from "../pages/passenger/";

export const passengerRoutes = [
  <Route
    key="passenger"
    path="/passenger"
    element={<ProtectedRoute allowedRoles={["passenger"]} />}
  >
    <Route element={<Layout />}>
      <Route index element={<PassengerDashboard />} />
      <Route path="profile" element={<PassengerProfile />} />
      <Route path="bookings" element={<PassengerBookings />} />
      <Route path="search" element={<PassengerSearch />} />
    </Route>
  </Route>,
];
