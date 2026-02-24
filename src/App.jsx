import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppProvider } from './context/AppContext';
import AdminApp       from './admin/AdminApp';
import Layout         from './components/layout/Layout';
import HomePage       from './pages/HomePage';
import AboutPage      from './pages/AboutPage';
import ProgramsPage   from './pages/ProgramsPage';
import GalleryPage    from './pages/GalleryPage';
import ContactPage    from './pages/ContactPage';
import NotFoundPage   from './pages/NotFoundPage';

// Konfigurasi React Query — data di-cache 5 menit, tidak refetch saat window focus
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Komponen pembantu: membungkus halaman dengan Layout
 */
const WithLayout = ({ children }) => <Layout>{children}</Layout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public website */}
          <Route path="/"             element={<WithLayout><HomePage       /></WithLayout>} />
          <Route path="/tentang"      element={<WithLayout><AboutPage      /></WithLayout>} />
          <Route path="/program"      element={<WithLayout><ProgramsPage   /></WithLayout>} />
          <Route path="/galeri"       element={<WithLayout><GalleryPage    /></WithLayout>} />
          <Route path="/kontak"       element={<WithLayout><ContactPage    /></WithLayout>} />

          {/* Admin Panel — jalur terpisah dari website publik */}
          <Route path="/admin/*"      element={<AdminApp />} />

          <Route path="*"             element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
