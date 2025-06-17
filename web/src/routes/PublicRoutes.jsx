import { Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import { Login, Register, VerifyAccount } from "../pages/auth/";
import AgencyCreationPage from "../pages/AgencyCreationPage";
import { Layout, AuthLayout } from "../components/layout";

// Export individual route elements with full paths
export const publicRoutes = [
  <Route key="home" path="/" element={<Layout />}>
    <Route index element={<LandingPage />} />
  </Route>,
  <Route key="login" path="/login" element={<AuthLayout />}>
    <Route index element={<Login />} />
  </Route>,
  <Route key="register" path="/register" element={<AuthLayout />}>
    <Route index element={<Register />} />
  </Route>,
  <Route
    key="agency-registration"
    path="/agency-registration"
    element={<AgencyCreationPage />}
  />,
  <Route
    key="verify-account"
    path="/verify-account"
    element={<VerifyAccount />}
  />,
];
