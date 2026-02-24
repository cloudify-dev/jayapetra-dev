import { FiAlertCircle } from 'react-icons/fi';

/**
 * Komponen untuk menampilkan pesan error.
 */
const ErrorMessage = ({ message = 'Gagal memuat data. Silakan coba lagi.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    <FiAlertCircle className="text-red-400 mb-3" size={48} />
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-primary"
      >
        Coba Lagi
      </button>
    )}
  </div>
);

export default ErrorMessage;
