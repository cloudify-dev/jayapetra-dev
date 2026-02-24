import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="font-heading font-bold text-6xl text-primary-600 mb-2">404</h1>
      <h2 className="font-heading font-semibold text-2xl text-gray-900 mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <FiArrowLeft size={16} /> Kembali ke Beranda
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
