import { Outlet, Route } from "react-router-dom";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import {
  ProfileCompletionLayout,
  DashboardLayout
} from "../components/layout";
import { DashboardContextWrapper } from "../contexts/wrappers";

// Agency Admin Pages
import {
  Dashboard as AgencyDashboard,
  Buses as AgencyBuses,
  Routes as AgencyRoutesPage,
  Bookings as AgencyBookings,
  Stations as AgencyStations,
  Reports as AgencyReports,
  Schedule as AgencySchedules,
  ProfileCompletion as AgencyProfileCompletion,
  DocumentUpload as AgencyDocumentUpload,
  StationSetup as AgencyStationSetup,
  Staff as AgencyStaff,
  Notifications as AgencyNotifications,
  AgencyProfile,
  Profile,
} from "../pages/agency/admin";

export const agencyAdminRoutes = [
  <Route
    key="agency-admin"
    path="/agency/admin"
    element={<ProtectedRoute allowedRoles={["agency_admin"]} />}
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
      {/* Pages using the main admin layout */}
      <Route element={<DashboardLayout />}>
        <Route index element={<AgencyDashboard />} />
        <Route path="agency-profile" element={<AgencyProfile />} />
        <Route path="buses" element={<AgencyBuses />} />
        <Route path="routes" element={<AgencyRoutesPage />} />
        <Route path="bookings" element={<AgencyBookings />} />
        <Route path="stations" element={<AgencyStations />} />
        <Route path="notifications" element={<AgencyNotifications />} />
        <Route path="reports" element={<AgencyReports />} />
        <Route path="staff" element={<AgencyStaff />} />
        <Route path="schedules" element={<AgencySchedules />} />
        <Route path="profile" element={<Profile />} />
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
