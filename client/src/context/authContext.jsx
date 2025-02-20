// authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext(null);

/**
 * The AuthProvider component manages authentication state, including checking user authorization,
 * logging in users, and logging them out.
 * @returns either a loading message (`<div>Loading...</div>`) if
 * the authentication state is still loading, or it returns the `AuthContext.Provider` component with
 * the authentication state values, `setUserStateLogin`, `logout`, and `checkAuthStatus` functions
 * provided as context values to its children components.
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthorized: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Razouq: some helping functions:
  /** @Faisal4z @Hassanalmaymn
   * ? Razouq:
   * ? My preferance is to move the helper functions to the bottem of the block (after the return statment) to make the code more readable instead of injecting them in the midddle 💔💔
   * ? Also changing them to `function f(){}` syntax, and only use the `const funcName=()=>{}` syntax for the components
   * ? Any way, I didn't move them beacause GPT said this not the best practice because it will make the code less readable, So may be u depended on that 🙃 I think it's an AI hallucination
   */

  /**
   * @author Razouq
   *
   * If there's an active session for the user on the server,
   * the function fetches the user data from the server and assigns it to `authState`.
   *
   * If not, it assigns `null` to the user data and `false` to the other attributes.
   */

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("protected/userData");
      console.log("checkAuthStatus is run"); // actually it is called :)
      if (response.status === 200) {
        // ? Razouq: I think u should call setUserStateLogin() here insted of setAuthState()
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
   * Razouq
   *
   * @param {*} userData - The user data object containing user details.
   *
   * This function updates the authentication state by setting the user as authorized
   * and storing their details in `authState`.
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
  /**
   * Logs out the user by sending a logout request to the server.
   *
   * This function makes a POST request to `"auth/logout"`. If the request is
   * successful (status 200), it updates the authentication state to indicate
   * that the user is logged out.
   *
   * @returns {Promise<boolean>} Returns `true` if logout is successful, otherwise `false`.

   */
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

  /*
   * The remainaing function instructions
   */
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

/**
 * The useAuth function is a custom hook in React that retrieves the authentication context from the
 * nearest AuthProvider.
 * @returns The `context` obtained from the `useContext(AuthContext)` hook.
 *
 * If the `context` is not available
 *  (i.e., `!context`), an error is thrown with the message "useAuth must be used within an AuthProvider".
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
