import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage(token(), null);
  const navigate = useNavigate();

  const login = async (data) => {
    setUser(data);
    navigate("/", { replace: true });
  };

  const logout = () => {
    setUser(null);
    window.localStorage.clear();
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  function token() {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
      var key = keys[i];
    }
    if (values.length) {
      if (values[0] == "null") {
        return Math.random().toString(36);
      } else {
        return key;
      }
    } else return Math.random().toString(36);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
