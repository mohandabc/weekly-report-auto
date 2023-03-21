/******************************************************************
 * SIGNING OUT THE USER BY CALLING THE LOGOUT METHOD FROM USEAUTH *
 ******************************************************************/

import { useAuth } from "../../api/useAuth";

export const LogoutPage = () => {
  const { logout } = useAuth();
  logout();
  return
};
