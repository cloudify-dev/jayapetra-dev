import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout    from './components/AdminLayout';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import ArticlesPage   from './pages/ArticlesPage';
import ArticleFormPage from './pages/ArticleFormPage';
import ProgramsPage   from './pages/ProgramsPage';
import ProgramFormPage from './pages/ProgramFormPage';
import GalleryPage    from './pages/GalleryPage';
import GalleryFormPage from './pages/GalleryFormPage';
import ContactsPage   from './pages/ContactsPage';
import AboutFormPage  from './pages/AboutFormPage';
import SiteSettingsPage from './pages/SiteSettingsPage';
import DonationAccountsPage from './pages/DonationAccountsPage';
import BoardMembersPage from './pages/BoardMembersPage';

/** Proteksi route: redirect ke login jika belum login */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAdminAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
};

const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />

    {/* Semua route di bawah ini butuh login */}
    <Route path="*" element={
      <ProtectedRoute>
        <AdminLayout>
          <Routes>
            <Route index              element={<DashboardPage />} />
            <Route path="artikel"     element={<ArticlesPage />} />
            <Route path="artikel/:id" element={<ArticleFormPage />} />
            <Route path="program"     element={<ProgramsPage />} />
            <Route path="program/:id" element={<ProgramFormPage />} />
            <Route path="galeri"      element={<GalleryPage />} />
            <Route path="galeri/:id"  element={<GalleryFormPage />} />
            <Route path="pesan"       element={<ContactsPage />} />
            <Route path="tentang"     element={<AboutFormPage />} />
            <Route path="site-settings"    element={<SiteSettingsPage />} />
            <Route path="rekening-donasi"  element={<DonationAccountsPage />} />
            <Route path="pengurus"         element={<BoardMembersPage />} />
            <Route path="*"           element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminLayout>
      </ProtectedRoute>
    } />
  </Routes>
);

/** Titik masuk admin panel — membungkus semua route admin */
const AdminApp = () => (
  <AdminAuthProvider>
    <AdminRoutes />
  </AdminAuthProvider>
);

export default AdminApp;
