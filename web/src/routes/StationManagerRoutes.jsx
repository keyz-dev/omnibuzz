// routes/AgencyRoutes.jsx
import { Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";

// Station Manager Pages
import {
  Dashboard as ManagerDashboard,
  Bookings as ManagerBookings,
  Buses as ManagerBuses,
  Routes as ManagerRoutes,
  Profile as ManagerProfile,
  Reports as ManagerReports,
  Schedules as ManagerSchedules,
} from "../pages/agency/manager";

export const stationManagerRoutes = [
  <Route
    key={"station-manager"}
    path="/agency/manager"
    element={
      <ProtectedRoute allowedRoles={["station_manager"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<ManagerDashboard />} />
    <Route path="bookings" element={<ManagerBookings />} />
    <Route path="buses" element={<ManagerBuses />} />
    <Route path="routes" element={<ManagerRoutes />} />
    <Route path="profile" element={<ManagerProfile />} />
    <Route path="reports" element={<ManagerReports />} />
    <Route path="schedules" element={<ManagerSchedules />} />
  </Route>,
];
