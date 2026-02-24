import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';
import { useApp } from '../../context/AppContext';

/**
 * Layout utama yang membungkus semua halaman.
 * Terdiri dari Navbar (atas), konten halaman, Footer (bawah), dan tombol WhatsApp mengambang.
 */
const Layout = ({ children }) => {
  const { notification } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Notifikasi global */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all
            ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {notification.message}
        </div>
      )}

      {/* Konten utama — pt-16 untuk memberi ruang navbar fixed */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Layout;
