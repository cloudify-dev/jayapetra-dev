import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiEye } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import {
  getArticleBackend,
  createArticleBackend,
  updateArticleBackend,
  publishArticleBackend,
} from '../services/backendAdminApi';

const EMPTY = { title: '', slug: '', excerpt: '', content: '' };

const ArticleFormPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = id && id !== 'baru';

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    if (!isEdit) return;
    setLoading(true);
    try {
      const data = await getArticleBackend(id);
      setForm({
        title:   data?.title   ?? '',
        slug:    data?.slug    ?? '',
        excerpt: data?.excerpt ?? '',
        content: data?.content ?? '',
      });
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (andPublish = false) => {
    if (!form.title.trim()) { setError('Judul wajib diisi.'); return; }
    setSaving(true);
    setError('');
    try {
      let savedId = id;
      if (isEdit) {
        await updateArticleBackend(id, form);
      } else {
        const data = await createArticleBackend(form);
        savedId = data?.id;
      }
      if (andPublish && savedId) await publishArticleBackend(savedId);
      setSuccess(andPublish ? 'Artikel berhasil disimpan dan ditayangkan!' : 'Artikel berhasil disimpan sebagai draft.');
      setTimeout(() => navigate('/admin/artikel'), 1200);
    } catch {
      setError('Gagal menyimpan. Pastikan semua field terisi dengan benar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Memuat...</div>;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        subtitle="Isi judul, ringkasan, dan konten artikel"
      >
        <Link to="/admin/artikel" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiArrowLeft size={14} /> Kembali
        </Link>
      </PageHeader>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Form Utama */}
        <div className="lg:col-span-2 space-y-4">
          <AdminCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  name="title" value={form.title} onChange={handleChange}
                  placeholder="Tulis judul artikel yang menarik..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ringkasan <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(tampil di daftar berita)</span>
                </label>
                <textarea
                  name="excerpt" value={form.excerpt} onChange={handleChange}
                  rows={3} maxLength={300}
                  placeholder="Tuliskan ringkasan singkat artikel (maks. 300 karakter)..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/300</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content" value={form.content} onChange={handleChange}
                  rows={14}
                  placeholder="Tulis isi artikel di sini... (mendukung HTML dasar)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y font-mono"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Panel Kanan */}
        <div className="space-y-4">
          <AdminCard title="Simpan & Tayangkan">
            <div className="space-y-2">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                <FiEye size={15} /> {saving ? 'Menyimpan...' : 'Simpan & Tayangkan'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <FiSave size={15} /> Simpan sebagai Draft
              </button>
            </div>
          </AdminCard>

          <AdminCard title="URL Artikel">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug (URL)</label>
              <input
                name="slug" value={form.slug} onChange={handleChange}
                placeholder="url-artikel-anda"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">
                Biarkan kosong untuk otomatis dari judul
              </p>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ArticleFormPage;
