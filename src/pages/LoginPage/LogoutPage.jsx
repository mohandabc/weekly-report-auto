/******************************************************************
 * SIGNING OUT THE USER BY CALLING THE LOGOUT METHOD FROM USEAUTH *
 ******************************************************************/

import { useAuth } from "../../services/useAuth";

export const LogoutPage = () => {
  const { logout } = useAuth();
  logout();
  return
};
