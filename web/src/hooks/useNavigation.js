// hooks/useNavigation.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES, USER_ROLES } from "../constants/routes";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateByRole = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    switch (user.role) {
      case USER_ROLES.PASSENGER:
        navigate(ROUTES.PASSENGER.DASHBOARD);
        break;
      case USER_ROLES.AGENCY_ADMIN:
        navigate(ROUTES.AGENCY_ADMIN.DASHBOARD);
        break;
      case USER_ROLES.AGENCY_MANAGER:
        navigate(ROUTES.AGENCY_MANAGER.DASHBOARD);
        break;
      case USER_ROLES.SYSTEM_ADMIN:
        navigate(ROUTES.SYSTEM_ADMIN.DASHBOARD);
        break;
      default:
        navigate(ROUTES.HOME);
    }
  };

  const goToProfile = () => {
    if (!user) return;

    switch (user.role) {
      case USER_ROLES.PASSENGER:
        navigate(ROUTES.PASSENGER.PROFILE);
        break;
      case USER_ROLES.AGENCY_ADMIN:
        navigate(ROUTES.AGENCY_ADMIN.PROFILE);
        break;
      case USER_ROLES.AGENCY_MANAGER:
        navigate(ROUTES.AGENCY_MANAGER.PROFILE);
        break;
      default:
        navigate(ROUTES.HOME);
    }
  };

  return {
    navigateByRole,
    goToProfile,
    navigate,
    routes: ROUTES,
  };
};
