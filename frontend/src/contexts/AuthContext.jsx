
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES } from '../utils/language';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Persist session if needed
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear session
  };

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    user,
    isAuthenticated,
    language,
    theme,
    login,
    logout,
    changeLanguage,
    toggleTheme,
    languages: LANGUAGES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
