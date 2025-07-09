import { Route } from "react-router-dom";
import { Home, About, ContactUs, AgencyCreationPage } from "../pages/home";
import {
  Login,
  Register,
  VerifyAccount,
  AcceptInvitation,
} from "../pages/auth/";
import { Layout, AuthLayout } from "../components/layout";

// Export individual route elements with full paths
export const publicRoutes = [
  <Route key="home" path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact-us" element={<ContactUs />} />
  </Route>,
  <Route key="login" path="/login" element={<AuthLayout />}>
    <Route index element={<Login />} />
  </Route>,
  <Route key="register" element={<AuthLayout />}>
    <Route path="/register" element={<Register />} />
    <Route path="/accept-invitation/" element={<AcceptInvitation />} />
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
