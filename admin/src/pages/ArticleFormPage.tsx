import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesApi, categoriesApi, uploadApi, type Article, type Category } from '../api';

export default function ArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', categoryId: '', thumbnailId: '' });
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoriesApi.list().then(({ data }) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      articlesApi
        .get(id)
        .then(({ data }) => {
          setForm({
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            categoryId: data.categoryId || '',
            thumbnailId: (data.thumbnail as { id?: string })?.id || '',
          });
          const t = data.thumbnail as { url?: string } | null;
          setThumbUrl(t?.url || null);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await uploadApi.file(fd);
    setForm((f) => ({ ...f, thumbnailId: data.data.id }));
    setThumbUrl(data.data.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        categoryId: form.categoryId || null,
        thumbnailId: form.thumbnailId || null,
      };
      if (isNew) {
        await articlesApi.create(payload);
      } else if (id) {
        await articlesApi.update(id, payload);
      }
      navigate('/artikel');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) return <div className="p-12 text-center">Memuat...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Tambah Artikel' : 'Edit Artikel'}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Pilih --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm" />
          {thumbUrl && <img src={thumbUrl} alt="" className="mt-2 h-24 object-cover rounded" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/artikel')} className="px-4 py-2 border rounded-lg">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
