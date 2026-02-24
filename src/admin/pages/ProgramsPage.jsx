import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import AdminTable from '../components/AdminTable';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import { getProgramsBackend, deleteProgramBackend, publishProgramBackend } from '../services/backendAdminApi';

const ProgramsPage = () => {
  const navigate = useNavigate();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProgramsBackend();
      setRows(data?.results ?? []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try { await deleteProgramBackend(confirm.id); await load(); }
    finally { setConfirm({ open: false, id: null, loading: false }); }
  };

  const handlePublish = async (row) => {
    const id = row.documentId ?? row.id;
    try { await publishProgramBackend(id); await load(); } catch { /**/ }
  };

  const columns = [
    {
      key: 'icon',
      label: '',
      render: (row) => <span className="text-xl">{row.icon ?? '📋'}</span>,
    },
    {
      key: 'title',
      label: 'Nama Program',
      render: (row) => <span className="font-medium text-gray-800">{row.title}</span>,
    },
    {
      key: 'location',
      label: 'Lokasi',
      render: (row) => <span className="text-gray-500 text-xs">{row.location ?? '—'}</span>,
    },
    {
      key: 'beneficiaries',
      label: 'Penerima Manfaat',
      render: (row) => <span className="text-xs text-gray-600">{row.beneficiaries ?? '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge published={!!row.publishedAt} />,
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          {!row.publishedAt && (
            <button onClick={() => handlePublish(row)} title="Tayangkan"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <FiEye size={14} />
            </button>
          )}
          <button onClick={() => navigate(`/admin/program/${row.documentId ?? row.id}`)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <FiEdit2 size={14} />
          </button>
          <button onClick={() => setConfirm({ open: true, id: row.documentId ?? row.id, loading: false })}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-primary-600 transition-colors">
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Program Yayasan" subtitle={`${rows.length} program terdaftar`}>
        <Link to="/admin/program/baru"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <FiPlus size={15} /> Tambah Program
        </Link>
      </PageHeader>

      <AdminCard>
        <AdminTable columns={columns} rows={rows} loading={loading} emptyMessage="Belum ada program. Tambahkan program pertama Yakapetra!" />
      </AdminCard>

      <ConfirmModal
        isOpen={confirm.open} loading={confirm.loading}
        title="Hapus Program" message="Program ini akan dihapus permanen. Yakin?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
};

export default ProgramsPage;
