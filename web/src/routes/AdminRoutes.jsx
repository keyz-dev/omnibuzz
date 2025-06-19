// routes/AdminRoutes.jsx
import { Route } from "react-router-dom";
import { Layout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
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
    <Route element={<Layout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="agencies" element={<AdminAgencies />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Route>,
];
