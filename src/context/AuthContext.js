  import React, { createContext, useContext, useState, useEffect } from "react";
  import { isTokenExpired } from "../utils/checkToken"; // ✅ make sure this is valid

  const AuthContext = createContext();

  export const useAuth = () => useContext(AuthContext);

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");
      const savedRole = localStorage.getItem("role");

      // ✅ Check if token exists and is not expired
      if (token && userEmail && savedRole && !isTokenExpired()) {
        setUser({ email: userEmail });
        setRole(savedRole);
      } else {
        localStorage.clear();
      }
    }, []);

    const login = (userData, role) => {
      localStorage.setItem("userId", userData.userId);
      setUser(userData);
      setRole(role);
      localStorage.setItem("email", userData.email);
    };

    const logout = () => {
      setUser(null);
      setRole(null);
      localStorage.clear(); // clears token, userId, role etc
    };

    return (
      <AuthContext.Provider value={{ user, role, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
