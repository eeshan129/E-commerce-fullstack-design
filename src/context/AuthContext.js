import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // On first load, check if user data was previously saved in localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('myshop_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('myshop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('myshop_user');
    }
  }, [user]);

  const login = (userData) => setUser(userData);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('myshop_user');
  };

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user; // converts user object to true/false

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}