import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleFormPage from './pages/ArticleFormPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramFormPage from './pages/ProgramFormPage';
import GalleriesPage from './pages/GalleriesPage';
import GalleryFormPage from './pages/GalleryFormPage';
import ContactsPage from './pages/ContactsPage';
import AboutPage from './pages/AboutPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="artikel" element={<ArticlesPage />} />
                <Route path="artikel/:id" element={<ArticleFormPage />} />
                <Route path="program" element={<ProgramsPage />} />
                <Route path="program/:id" element={<ProgramFormPage />} />
                <Route path="galeri" element={<GalleriesPage />} />
                <Route path="galeri/:id" element={<GalleryFormPage />} />
                <Route path="pesan" element={<ContactsPage />} />
                <Route path="tentang" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
