/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin } from '../services/adminApi';
import { backendLogin } from '../services/backendAdminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('yakapetra_admin_user');
    const savedToken = localStorage.getItem('yakapetra_admin_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Login lewat backend (database yayasan_cms)
    try {
      const backendRes = await backendLogin(email, password);
      const { token, user: backendUser } = backendRes.data?.data || {};
      if (token && backendUser) {
        localStorage.setItem('yakapetra_backend_token', token);
        localStorage.setItem('yakapetra_admin_token', token);
        const adminUser = { id: backendUser.id, email: backendUser.email, username: backendUser.email, ...backendUser };
        localStorage.setItem('yakapetra_admin_user', JSON.stringify(adminUser));
        setUser(adminUser);
        return adminUser;
      }
      throw new Error('Email atau password salah.');
    } catch (err) {
      // 401 = email/password salah, jangan coba Strapi
      if (err.response?.status === 401) {
        throw new Error('Email atau password salah.');
      }
      // Backend tidak jalan / network error
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        throw new Error('Backend tidak dapat dihubungi. Pastikan server berjalan di port 4000.');
      }
      // Coba Strapi hanya jika masih dipakai
      try {
        const { data } = await adminLogin(email, password);
        const { token, user: adminUser } = data.data;
        localStorage.setItem('yakapetra_admin_token', token);
        localStorage.setItem('yakapetra_admin_user', JSON.stringify(adminUser));
        setUser(adminUser);
        return adminUser;
      } catch {
        throw new Error('Email atau password salah.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('yakapetra_admin_token');
    localStorage.removeItem('yakapetra_backend_token');
    localStorage.removeItem('yakapetra_admin_user');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth harus di dalam AdminAuthProvider');
  return ctx;
};
