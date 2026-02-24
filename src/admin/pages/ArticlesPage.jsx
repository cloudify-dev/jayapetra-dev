import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import AdminTable from '../components/AdminTable';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import {
  getArticlesBackend,
  deleteArticleBackend,
  publishArticleBackend,
  unpublishArticleBackend,
} from '../services/backendAdminApi';
import { formatDate } from '../../utils/helpers';

const ArticlesPage = () => {
  const navigate         = useNavigate();
  const [rows, setRows]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticlesBackend();
      setRows(data?.results ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await deleteArticleBackend(confirm.id);
      await load();
    } finally {
      setConfirm({ open: false, id: null, loading: false });
    }
  };

  const togglePublish = async (row) => {
    const id = row.documentId ?? row.id;
    try {
      if (row.publishedAt) await unpublishArticleBackend(id);
      else await publishArticleBackend(id);
      await load();
    } catch {/* ignore */}
  };

  const columns = [
    {
      key: 'title',
      label: 'Judul',
      render: (row) => (
        <span className="font-medium text-gray-800 line-clamp-1 max-w-xs">{row.title}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge published={!!row.publishedAt} />,
    },
    {
      key: 'createdAt',
      label: 'Dibuat',
      render: (row) => <span className="text-gray-500 text-xs">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePublish(row)}
            title={row.publishedAt ? 'Jadikan Draft' : 'Tayangkan'}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            {row.publishedAt ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
          <button
            onClick={() => navigate(`/admin/artikel/${row.documentId ?? row.id}`)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => setConfirm({ open: true, id: row.documentId ?? row.id, loading: false })}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-primary-600 transition-colors"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Artikel & Berita" subtitle={`${rows.length} artikel tersedia`}>
        <Link
          to="/admin/artikel/baru"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus size={15} /> Tulis Artikel
        </Link>
      </PageHeader>

      <AdminCard>
        <AdminTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyMessage="Belum ada artikel. Mulai tulis artikel pertama Anda!"
        />
      </AdminCard>

      <ConfirmModal
        isOpen={confirm.open}
        loading={confirm.loading}
        title="Hapus Artikel"
        message="Artikel ini akan dihapus permanen dan tidak bisa dikembalikan. Yakin?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
};

export default ArticlesPage;
