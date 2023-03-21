/**********************************************************************************
 * PREVENT UNLOGGED USERS FROM ACCESSING TO A PAGE AND REDIRECTING THEM TO /LOGIN *
 * ELSE RETURN THE ACTUAL PROTECTED PAGE WHICH IS IN THIS CASE THE CHILDREN PARAM *
 *              PLEASE REFER TO SRC/INDEX.JS TO SEE HOW IT IS USED.               *
 **********************************************************************************/

import { Navigate } from "react-router-dom";
import { LOCALSTORAGE_SALTKEY } from "../../constants/SALTKEY";
import { useAuth } from "../../api/useAuth";
import { decrypt } from "../../services/utils";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Navigate to the login page if user is null.
  if (!user) return <Navigate to="/login" />
  // Navigate to the login page if keyID doesnt match the crypted token (In Case the Local storage is stolen)
  if ((user['keyID']!==decrypt(LOCALSTORAGE_SALTKEY, user['token']))) return <Navigate to="/login" />;
  // Returns children of this component (in this case the protected component).
  return children;
  }

