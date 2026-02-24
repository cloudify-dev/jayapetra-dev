import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { galleriesApi, type Gallery } from '../api';

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function GalleriesPage() {
  const [rows, setRows] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await galleriesApi.list();
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
      await galleriesApi.delete(confirm.id);
      await load();
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  const togglePublish = async (row: Gallery) => {
    try {
      if (!row.publishedAt) await galleriesApi.publish(row.id);
      await load();
    } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Galeri</h1>
        <Link
          to="/galeri/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          <FiPlus size={18} />
          Tambah Galeri
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat...</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Belum ada galeri.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium w-20">Foto</th>
                <th className="px-4 py-3 font-medium w-24">Status</th>
                <th className="px-4 py-3 font-medium w-32">Dibuat</th>
                <th className="px-4 py-3 font-medium w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{row.images?.length || 0} foto</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        row.publishedAt ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {row.publishedAt ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {!row.publishedAt && (
                        <button
                          onClick={() => togglePublish(row)}
                          title="Tayangkan"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <FiEye size={15} />
                        </button>
                      )}
                      <Link
                        to={`/galeri/${row.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => setConfirm({ open: true, id: row.id })}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <p className="text-gray-700 mb-4">Hapus galeri ini?</p>
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
