import { Outlet, Route } from "react-router-dom";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import {
  DefaultAdminHeaderLayout,
  ProfileCompletionLayout,
} from "../components/layout";
import { AgencyAdminProvider } from "../stateManagement/contexts";

// Agency Admin Pages
import {
  Dashboard as AgencyDashboard,
  Profile as AgencyProfile,
  Buses as AgencyBuses,
  Routes as AgencyRoutesPage,
  Bookings as AgencyBookings,
  Reports as AgencyReports,
  Schedule as AgencySchedules,
  ProfileCompletion as AgencyProfileCompletion,
  DocumentUpload as AgencyDocumentUpload,
  StationSetup as AgencyStationSetup,
} from "../pages/agency/admin";

export const agencyAdminRoutes = [
  <Route
    key="agency-admin"
    path="/agency/admin"
    element={<ProtectedRoute allowedRoles={["agency_admin"]} />}
  >
    {/* Context provider wraps all subroutes */}
    <Route
      element={
        <AgencyAdminProvider>
          <Outlet />
        </AgencyAdminProvider>
      }
    >
      {/* Pages using the main admin layout */}
      <Route element={<DefaultAdminHeaderLayout />}>
        <Route index element={<AgencyDashboard />} />
        <Route path="profile" element={<AgencyProfile />} />
        <Route path="buses" element={<AgencyBuses />} />
        <Route path="routes" element={<AgencyRoutesPage />} />
        <Route path="bookings" element={<AgencyBookings />} />
        <Route path="reports" element={<AgencyReports />} />
        <Route path="schedules" element={<AgencySchedules />} />
      </Route>

      {/* Pages using the profile completion layout */}
      <Route element={<ProfileCompletionLayout />}>
        <Route
          path="profile-completion"
          element={<AgencyProfileCompletion />}
        />
        <Route path="upload-documents" element={<AgencyDocumentUpload />} />
      </Route>

      {/* Standalone setup page (no special layout) */}
      <Route path="station-setup" element={<AgencyStationSetup />} />
    </Route>
  </Route>,
];
