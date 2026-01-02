import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setAuthToken(savedToken);
      setToken(savedToken);
      // user info can be enhanced by calling /me endpoint if you add one
    }
  }, []);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    setAuthToken(token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
