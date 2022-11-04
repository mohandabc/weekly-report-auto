
import { useAuth } from "../../services/useAuth";

export const LogoutPage = () => {
  const { logout } = useAuth();
  logout();
  return
};
