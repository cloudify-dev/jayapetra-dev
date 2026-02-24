/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

/**
 * AppProvider membungkus seluruh aplikasi dan menyediakan
 * state global yang bisa diakses dari komponen manapun.
 */
export const AppProvider = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification]         = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const value = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    notification,
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook untuk menggunakan AppContext.
 * Harus digunakan di dalam komponen yang dibungkus AppProvider.
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp harus digunakan di dalam AppProvider');
  return context;
};
