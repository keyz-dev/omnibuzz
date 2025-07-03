// routes/AdminRoutes.jsx
import { Outlet, Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import { DashboardContextWrapper } from "../contexts/wrappers";
import {
  Dashboard as AdminDashboard,
  Agencies as AdminAgencies,
  Users as AdminUsers,
  Documents as AdminDocuments,
  Reports as AdminReports,
  Notifications as AdminNotifications,
  Profile as AdminProfile,
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
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Route>,
];
