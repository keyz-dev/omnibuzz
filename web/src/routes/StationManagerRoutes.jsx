// routes/AgencyRoutes.jsx
import { Outlet, Route } from "react-router-dom";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import { DashboardContextWrapper } from "../contexts/wrappers";
import { DashboardLayout } from "../components/layout";

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
    element={<ProtectedRoute allowedRoles={["station_manager"]} />}
  >
    {/* Context provider wraps all subroutes */}
    <Route
      path="*"
      element={
        <DashboardContextWrapper>
          <Outlet />
        </DashboardContextWrapper>
      }
    >
      <Route element={<DashboardLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="bookings" element={<ManagerBookings />} />
        <Route path="buses" element={<ManagerBuses />} />
        <Route path="routes" element={<ManagerRoutes />} />
        <Route path="profile" element={<ManagerProfile />} />
        <Route path="reports" element={<ManagerReports />} />
        <Route path="schedules" element={<ManagerSchedules />} />
      </Route>
    </Route>
  </Route>,
];
