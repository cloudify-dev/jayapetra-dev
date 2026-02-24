import { FiAlertTriangle } from 'react-icons/fi';

/** Modal konfirmasi hapus atau aksi berbahaya */
const ConfirmModal = ({ isOpen, onConfirm, onCancel, title = 'Konfirmasi', message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-red-600" size={20} />
          </div>
          <h3 className="font-heading font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
