/**********************************************************************************
 * PREVENT UNLOGGED USERS FROM ACCESSING TO A PAGE AND REDIRECTING THEM TO /LOGIN *
 * ELSE RETURN THE ACTUAL PROTECTED PAGE WHICH IS IN THIS CASE THE CHILDREN PARAM *
 *              PLEASE REFER TO SRC/INDEX.JS TO SEE HOW IT IS USED.               *
 **********************************************************************************/

import { Navigate } from "react-router-dom";
import { LoginPage } from "../../pages"
import { useAuth } from "../../services/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};