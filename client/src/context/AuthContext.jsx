// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // reusable function to check auth
  const refreshAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/users/me`, {
        withCredentials: true,
      });
      setAuthUser(res.data.user);
    } catch (err) {
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        authLoading,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};