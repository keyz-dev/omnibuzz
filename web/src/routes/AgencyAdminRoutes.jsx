import { Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";

// Agency Admin Pages
import {
  Dashboard as AgencyDashboard,
  Profile as AgencyProfile,
  Buses as AgencyBuses,
  Routes as AgencyRoutesPage,
  Bookings as AgencyBookings,
  Reports as AgencyReports,
  Schedule as AgencySchedules,
} from "../pages/agency/admin";

export const agencyAdminRoutes = [
  <Route
    key={"agency-admin"}
    path="/agency/admin"
    element={
      <ProtectedRoute allowedRoles={["agency_admin"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AgencyDashboard />} />
    <Route path="profile" element={<AgencyProfile />} />
    <Route path="buses" element={<AgencyBuses />} />
    <Route path="routes" element={<AgencyRoutesPage />} />
    <Route path="bookings" element={<AgencyBookings />} />
    <Route path="reports" element={<AgencyReports />} />
    <Route path="schedules" element={<AgencySchedules />} />
  </Route>,
];
