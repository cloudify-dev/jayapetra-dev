import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import Loading from '../../components/ui/Loading';
import {
  getGalleriesBackend,
  deleteGalleryBackend,
  publishGalleryBackend,
} from '../services/backendAdminApi';
import { formatDate } from '../../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const imageUrl = (img) => {
  if (!img?.url) return null;
  return img.url.startsWith('http') ? img.url : `${API_URL}${img.url}`;
};

const GalleryPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getGalleriesBackend(1, 100);
      setRows(data.results ?? []);
    } catch (err) {
      setRows([]);
      if (err.response?.status === 401) {
        setError('Sesi backend habis. Logout lalu login lagi.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Backend tidak terjangkau. Jalankan: cd backend && npm run dev');
      } else {
        setError(err.response?.data?.error || 'Gagal memuat galeri.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await deleteGalleryBackend(confirm.id);
      await load();
    } catch {
      setError('Gagal menghapus album.');
    } finally {
      setConfirm({ open: false, id: null, loading: false });
    }
  };

  const handlePublish = async (id) => {
    setError('');
    try {
      await publishGalleryBackend(id);
      await load();
    } catch {
      setError('Gagal menerbitkan album.');
    }
  };

  return (
    <div>
      <PageHeader title="Galeri Foto" subtitle={`${rows.length} album tersimpan`}>
        <Link to="/admin/galeri/baru"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <FiPlus size={15} /> Tambah Album
        </Link>
      </PageHeader>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {loading ? <Loading /> : (
        <>
          {rows.length === 0 ? (
            <AdminCard>
              <div className="text-center py-12 text-gray-400">
                <FiImage size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Belum ada galeri. Upload foto kegiatan pertama!</p>
              </div>
            </AdminCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((album) => {
                const docId = album.id;
                const firstImg = album.images?.[0];
                const thumbUrl = imageUrl(firstImg);

                return (
                  <div key={docId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Thumbnail */}
                    <div className="h-36 bg-gray-100 overflow-hidden">
                      {thumbUrl
                        ? <img src={thumbUrl} alt={album.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300"><FiImage size={32} /></div>
                      }
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-sm text-gray-800 line-clamp-1">{album.title}</p>
                        <StatusBadge published={!!album.publishedAt} />
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        {album.images?.length ?? 0} foto · {formatDate(album.createdAt)}
                      </p>
                      <div className="flex gap-2">
                        {!album.publishedAt && (
                          <button onClick={() => handlePublish(docId)}
                            className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            Tayangkan
                          </button>
                        )}
                        <button onClick={() => navigate(`/admin/galeri/${docId}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => setConfirm({ open: true, id: docId, loading: false })}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-primary-600 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={confirm.open} loading={confirm.loading}
        title="Hapus Album" message="Album dan semua foto di dalamnya akan dihapus permanen. Yakin?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
};

export default GalleryPage;
