// routes/AdminRoutes.jsx
import { Outlet, Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import { DashboardContextWrapper } from "../stateManagement/contexts";
import {
  Dashboard as AdminDashboard,
  Agencies as AdminAgencies,
  Users as AdminUsers,
  Settings as AdminSettings,
} from "../pages/admin";

export const adminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={<ProtectedRoute allowedRoles={["system_admin"]} />}
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
        <Route index element={<AdminDashboard />} />
        <Route path="agencies" element={<AdminAgencies />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Route>,
];
