import { Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LandingPage from "../pages/LandingPage";
import {
  Login,
  Register,
  AgencyRegistration,
  VerifyAccount,
} from "../pages/auth/";

// Export individual route elements with full paths
export const publicRoutes = [
  <Route key="home" path="/" element={<Layout />}>
    <Route index element={<LandingPage />} />
  </Route>,
  <Route key="login" path="/login" element={<Layout />}>
    <Route index element={<Login />} />
  </Route>,
  <Route key="register" path="/register" element={<Layout />}>
    <Route index element={<Register />} />
  </Route>,
  <Route key="agency-reg" path="/agency-registration" element={<Layout />}>
    <Route index element={<AgencyRegistration />} />
  </Route>,
  <Route
    key="verify-account"
    path="/verify-account"
    element={<VerifyAccount />}
  />,
];
