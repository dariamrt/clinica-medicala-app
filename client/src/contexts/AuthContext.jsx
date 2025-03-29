import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/dashboard-admin");
    if (role === "doctor") navigate("/dashboard-doctor");
    if (role === "patient") navigate("/dashboard-patient");
  }, []);
  

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setUser(response);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
