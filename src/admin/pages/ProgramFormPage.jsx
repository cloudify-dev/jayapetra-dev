import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiEye } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import {
  getProgramBackend,
  createProgramBackend,
  updateProgramBackend,
  publishProgramBackend,
} from '../services/backendAdminApi';

const EMPTY = { title: '', slug: '', description: '', content: '', icon: '', beneficiaries: '', location: '', order: 0 };

const ProgramFormPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = id && id !== 'baru';

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    if (!isEdit) return;
    setLoading(true);
    try {
      const data = await getProgramBackend(id);
      setForm({
        title:         data?.title         ?? '',
        slug:          data?.slug          ?? '',
        description:   data?.description   ?? '',
        content:       data?.content       ?? '',
        icon:          data?.icon          ?? '',
        beneficiaries: data?.beneficiaries ?? '',
        location:      data?.location      ?? '',
        order:         data?.order         ?? 0,
      });
    } finally { setLoading(false); }
  }, [id, isEdit]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSave = async (andPublish = false) => {
    if (!form.title.trim() || !form.description.trim()) { setError('Nama program dan deskripsi wajib diisi.'); return; }
    setSaving(true); setError('');
    try {
      let savedId = id;
      if (isEdit) { await updateProgramBackend(id, form); }
      else { const data = await createProgramBackend(form); savedId = data?.id; }
      if (andPublish && savedId) await publishProgramBackend(savedId);
      setSuccess(andPublish ? 'Program berhasil disimpan dan ditayangkan!' : 'Program disimpan sebagai draft.');
      setTimeout(() => navigate('/admin/program'), 1200);
    } catch { setError('Gagal menyimpan. Pastikan semua field wajib terisi.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Memuat...</div>;

  const iconOptions = ['📚','✝️','🎨','🤝','🏘️','🎉','🌱','⭐','🎓','🏥','🔧','🎵'];

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Program' : 'Tambah Program Baru'} subtitle="Isi informasi program Yakapetra">
        <Link to="/admin/program" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiArrowLeft size={14} /> Kembali
        </Link>
      </PageHeader>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <AdminCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="Contoh: Bimbingan Pendidikan Anak Binaan"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} placeholder="Jelaskan program ini secara singkat..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten Detail (opsional)</label>
                <textarea name="content" value={form.content} onChange={handleChange}
                  rows={8} placeholder="Deskripsi lengkap program, tahapan, syarat, dll..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y" />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard title="Simpan">
            <div className="space-y-2">
              <button onClick={() => handleSave(true)} disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60">
                <FiEye size={15} /> {saving ? 'Menyimpan...' : 'Simpan & Tayangkan'}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60">
                <FiSave size={15} /> Simpan Draft
              </button>
            </div>
          </AdminCard>

          <AdminCard title="Ikon Program">
            <div className="grid grid-cols-6 gap-2 mb-3">
              {iconOptions.map((emoji) => (
                <button key={emoji} onClick={() => setForm({ ...form, icon: emoji })}
                  className={`text-xl p-1.5 rounded-lg transition-colors ${form.icon === emoji ? 'bg-primary-100 ring-2 ring-primary-400' : 'hover:bg-gray-100'}`}>
                  {emoji}
                </button>
              ))}
            </div>
            <input name="icon" value={form.icon} onChange={handleChange} placeholder="Atau ketik emoji..." maxLength={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </AdminCard>

          <AdminCard title="Info Tambahan">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Penerima Manfaat</label>
                <input name="beneficiaries" value={form.beneficiaries} onChange={handleChange}
                  placeholder="Contoh: 100+ anak binaan"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lokasi</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="Contoh: Klender, Jakarta Timur"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Urutan Tampil</label>
                <input type="number" name="order" value={form.order} onChange={handleChange} min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ProgramFormPage;
