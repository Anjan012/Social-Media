// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/user/me", {
          withCredentials: true,
        });
        setAuthUser(res.data.user);
      } catch (err) {
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


