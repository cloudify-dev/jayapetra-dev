import { useState, useEffect, useCallback } from 'react';
import { FiMail, FiTrash2, FiCheck, FiPhone, FiUser, FiMessageSquare } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../../components/ui/Loading';
import { getContactsBackend, deleteContactBackend, updateContactBackend } from '../services/backendAdminApi';
import { formatDate } from '../../utils/helpers';

const ContactsPage = () => {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm]   = useState({ open: false, id: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContactsBackend();
      setRows(data?.results ?? []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (row) => {
    if (row.is_read) return;
    try { await updateContactBackend(row.id, { is_read: true }); await load(); } catch { /**/ }
  };

  const handleDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try { await deleteContactBackend(confirm.id); setSelected(null); await load(); }
    finally { setConfirm({ open: false, id: null, loading: false }); }
  };

  const unreadCount = rows.filter((r) => !(r.is_read ?? r.isRead)).length;

  return (
    <div>
      <PageHeader
        title="Pesan Masuk"
        subtitle={`${rows.length} pesan · ${unreadCount} belum dibaca`}
      />

      {loading ? <Loading /> : rows.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12 text-gray-400">
            <FiMail size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Belum ada pesan masuk dari website.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Daftar Pesan */}
          <div className="lg:col-span-2 space-y-2">
            {rows.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); markRead(msg); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                  selected?.id === msg.id
                    ? 'border-primary-400 bg-primary-50'
                    : msg.is_read
                      ? 'border-gray-200 bg-white'
                      : 'border-primary-200 bg-red-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`text-sm font-medium ${msg.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {msg.name}
                    {!msg.is_read && <span className="ml-2 w-1.5 h-1.5 bg-primary-500 rounded-full inline-block" />}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-xs text-primary-600 font-medium mb-1">{msg.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Detail Pesan */}
          <div className="lg:col-span-3">
            {selected ? (
              <AdminCard>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900">{selected.subject}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => setConfirm({ open: true, id: selected.id, loading: false })}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-primary-600 transition-colors"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>

                <div className="space-y-3 mb-5 text-sm">
                  {[
                    { icon: FiUser,         label: 'Nama',    value: selected.name    },
                    { icon: FiMail,         label: 'Email',   value: selected.email   },
                    { icon: FiPhone,        label: 'Telepon', value: selected.phone || '—' },
                    { icon: FiMessageSquare, label: 'Subjek', value: selected.subject },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-gray-500" size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="font-medium text-gray-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiMail size={14} /> Balas via Email
                  </a>
                  {!selected.is_read && (
                    <button onClick={() => markRead(selected)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <FiCheck size={14} /> Tandai Dibaca
                    </button>
                  )}
                </div>
              </AdminCard>
            ) : (
              <AdminCard>
                <div className="text-center py-12 text-gray-400">
                  <FiMail size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Pilih pesan untuk melihat detailnya</p>
                </div>
              </AdminCard>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirm.open} loading={confirm.loading}
        title="Hapus Pesan" message="Pesan ini akan dihapus permanen. Yakin?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
};

export default ContactsPage;
