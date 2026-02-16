// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/user/me", {
          withCredentials: true,
        });
        setAuthUser(res.data.user);
      } catch (err) {
        setAuthUser(null);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
