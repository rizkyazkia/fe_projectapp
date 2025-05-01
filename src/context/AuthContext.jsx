import React, { createContext, useCallback, useMemo } from "react";
import { token } from "../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(null);

  const refreshToken = useCallback(async () => {
    try {
      const response = await token();
      setAccessToken(response.data.accessToken);

      if (response && response.data.accessToken) {
        const decoded = jwtDecode(response.data.accessToken);
        setUser(decoded);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const value = useMemo(
    () => ({ user, setUser, accessToken, setAccessToken, refreshToken }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
