import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import {
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
} from '../services/backendAdminApi';

const BoardMembersPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    description: '',
    photoUrl: '',
    sortOrder: 0,
    isActive: true,
  });

  const load = () => {
    setLoading(true);
    getBoardMembers()
      .then((res) => setList(res.data?.data ?? []))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          setError('Sesi backend habis. Logout lalu login lagi (pastikan backend berjalan di port 4000).');
        } else if (err.code === 'ERR_NETWORK' || !status) {
          setError('Backend tidak terjangkau. Jalankan: cd backend && npm run dev');
        } else {
          setError(err.response?.data?.error || 'Gagal memuat data.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'sortOrder' ? parseInt(value, 10) || 0 : name === 'isActive' ? e.target.checked : value,
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      position: '',
      description: '',
      photoUrl: '',
      sortOrder: list.length,
      isActive: true,
    });
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name ?? '',
      position: item.position ?? '',
      description: item.description ?? '',
      photoUrl: item.photoUrl ?? '',
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive !== false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (editing) {
      updateBoardMember(editing, form)
        .then(() => { setEditing(null); load(); })
        .catch((err) => setError(err.response?.data?.error || 'Gagal menyimpan'));
    } else {
      createBoardMember(form)
        .then(() => { openCreate(); load(); })
        .catch((err) => setError(err.response?.data?.error || 'Gagal menambah'));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Hapus pengurus ini?')) return;
    deleteBoardMember(id)
      .then(() => { if (editing === id) setEditing(null); load(); })
      .catch(() => setError('Gagal menghapus'));
  };

  return (
    <div>
      <PageHeader title="Pengurus Yayasan" subtitle="Kelola data pengurus yang tampil di website" />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Daftar Pengurus">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {list.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada pengurus. Tambah di form sebelah.</p>
              ) : (
                list.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-primary-600">{item.position}</p>
                      {!item.isActive && <span className="text-xs text-gray-500">(nonaktif)</span>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </AdminCard>

        <AdminCard title={editing ? 'Edit Pengurus' : 'Tambah Pengurus'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi singkat (opsional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto (opsional)</label>
              <input
                type="url"
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Aktif (tampil di website)</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editing ? 'Simpan' : 'Tambah'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="flex items-center gap-1 text-primary-600 text-sm font-medium"
                >
                  <FiPlus size={14} /> Baru
                </button>
              )}
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
};

export default BoardMembersPage;
