/***************************************************************
 *       THE USEAUTH HAS FOUR MAIN PURPOSES WHICH ARE :        *
 * HANDLING THE LOGIN, HANDLING THE LOGOUT, SETTING USER STATE *
 * AND BUILDING VARIABLE TOKENS TO BE STORED IN LOCAL STORAGE  *
 ***************************************************************/

import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { crypt } from "./utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (data) => {
    var keyID = keyId()
    Object.assign(data, { keyID : keyID, token : crypt("M4dji1S4lty", keyID)});
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

  function keyId() {
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
