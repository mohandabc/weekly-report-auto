/**********************************************************************************
 * PREVENT UNLOGGED USERS FROM ACCESSING TO A PAGE AND REDIRECTING THEM TO /LOGIN *
 * ELSE RETURN THE ACTUAL PROTECTED PAGE WHICH IS IN THIS CASE THE CHILDREN PARAM *
 *              PLEASE REFER TO SRC/INDEX.JS TO SEE HOW IT IS USED.               *
 **********************************************************************************/

import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/useAuth";
import { decrypt } from "../../services/utils";

export const ProtectedRoute = ({ children }) => {

  const { user } = useAuth();
  console.log("user", user);
  if (!user) return <Navigate to="/login" />
  if ((user['keyID']!==decrypt("M4dji1S4lty", user['token']))) return <Navigate to="/login" />;
  return children;
  }

