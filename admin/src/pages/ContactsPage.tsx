import { useState, useEffect } from 'react';
import { FiTrash2, FiMail } from 'react-icons/fi';
import { contactsApi, type Contact } from '../api';

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactsPage() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [detail, setDetail] = useState<Contact | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await contactsApi.list();
      setRows(data.results);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!confirm.id) return;
    try {
      await contactsApi.delete(confirm.id);
      await load();
      setDetail(null);
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  const markRead = async (row: Contact) => {
    if (row.isRead) return;
    try {
      await contactsApi.update(row.id, { isRead: true });
      await load();
      if (detail?.id === row.id) setDetail((d) => (d ? { ...d, isRead: true } : null));
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pesan Kontak</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat...</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Belum ada pesan.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {rows.map((row) => (
              <div
                key={row.id}
                onClick={() => {
                  setDetail(row);
                  markRead(row);
                }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-start ${
                  !row.isRead ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{row.name} — {row.subject}</p>
                  <p className="text-sm text-gray-500 truncate">{row.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(row.createdAt)}</p>
                </div>
                {!row.isRead && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm({ open: true, id: row.id });
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 ml-2"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{detail.subject}</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Dari:</strong> {detail.name}</p>
              <p><strong>Email:</strong> {detail.email}</p>
              {detail.phone && <p><strong>Telepon:</strong> {detail.phone}</p>}
              <p><strong>Tanggal:</strong> {formatDate(detail.createdAt)}</p>
              <hr className="my-3" />
              <p className="whitespace-pre-wrap">{detail.message}</p>
            </div>
            <button
              onClick={() => setDetail(null)}
              className="mt-4 px-4 py-2 border rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {confirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <p className="text-gray-700 mb-4">Hapus pesan ini?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirm({ open: false, id: null })} className="px-4 py-2 border rounded-lg">
                Batal
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
