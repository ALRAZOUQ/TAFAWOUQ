// authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthorized: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("protected/userData");
      console.log("checkAuthStatus is run"); // actually it is called :)
      if (response.status === 200) {
        setAuthState({
          isAuthorized: true,
          user: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            isAdmin: response.data.isadmin,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("checkAuthStatus is run");
        setAuthState({
          isAuthorized: false,
          user: null,
          isLoading: false,
        });
      }
    }
  };
  /**
   *
   * @param {*} userData
   *
   */
  const setUserStateLogin = (userData) => {
    setAuthState({
      isAuthorized: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isadmin,
      },
      isLoading: false,
    });
  };

  const logout = async () => {
    try {
      const response = await axios.post("auth/logout");

      if (response.status === 200) {
        setAuthState({
          isAuthorized: false,
          user: null,
          isLoading: false,
        });
        // You might want to redirect to login page here
        return true;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show an error message to the user
      return false;
    }
  };

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ ...authState, setUserStateLogin, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
