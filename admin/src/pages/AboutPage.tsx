import { useState, useEffect } from 'react';
import { aboutApi, uploadApi } from '../api';

export default function AboutPage() {
  const [form, setForm] = useState({
    vision: '',
    mission: '',
    values: '',
    history: '',
    establishedYear: '' as number | '',
    heroImageId: '',
    published: false,
  });
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    aboutApi
      .get()
      .then(({ data }) => {
        setForm({
          vision: data.vision || '',
          mission: data.mission || '',
          values: data.values || '',
          history: data.history || '',
          establishedYear: data.establishedYear ?? '',
          heroImageId: (data.heroImage as { id?: string })?.id || '',
          published: !!data.published,
        });
        const h = data.heroImage as { url?: string } | null;
        setHeroUrl(h?.url || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await uploadApi.file(fd);
    setForm((f) => ({ ...f, heroImageId: data.data.id }));
    setHeroUrl(data.data.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aboutApi.update({
        vision: form.vision,
        mission: form.mission,
        values: form.values || null,
        history: form.history || null,
        establishedYear: form.establishedYear === '' ? null : Number(form.establishedYear),
        heroImageId: form.heroImageId || null,
        published: form.published,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Memuat...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Halaman Tentang Kami</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visi</label>
          <textarea
            value={form.vision}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            required
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Misi</label>
          <textarea
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nilai-nilai</label>
          <textarea
            value={form.values}
            onChange={(e) => setForm({ ...form, values: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sejarah</label>
          <textarea
            value={form.history}
            onChange={(e) => setForm({ ...form, history: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Berdiri</label>
          <input
            type="number"
            value={form.establishedYear}
            onChange={(e) => setForm({ ...form, establishedYear: e.target.value ? parseInt(e.target.value) : '' })}
            placeholder="2010"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Hero</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm" />
          {heroUrl && <img src={heroUrl} alt="" className="mt-2 h-32 object-cover rounded" />}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Tayangkan di website
          </label>
        </div>
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
