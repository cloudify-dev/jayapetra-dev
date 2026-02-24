import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programsApi, uploadApi } from '../api';

export default function ProgramFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    icon: '',
    beneficiaries: '',
    location: '',
    order: 0,
    imageId: '',
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      programsApi
        .get(id)
        .then(({ data }) => {
          setForm({
            title: data.title,
            description: data.description,
            content: data.content || '',
            icon: data.icon || '',
            beneficiaries: data.beneficiaries || '',
            location: data.location || '',
            order: data.order,
            imageId: (data.image as { id?: string })?.id || '',
          });
          const img = data.image as { url?: string } | null;
          setImageUrl(img?.url || null);
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
    setForm((f) => ({ ...f, imageId: data.data.id }));
    setImageUrl(data.data.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        content: form.content || null,
        icon: form.icon || null,
        beneficiaries: form.beneficiaries || null,
        location: form.location || null,
        order: form.order,
        imageId: form.imageId || null,
      };
      if (isNew) {
        await programsApi.create(payload);
      } else if (id) {
        await programsApi.update(id, payload);
      }
      navigate('/program');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) return <div className="p-12 text-center">Memuat...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Tambah Program' : 'Edit Program'}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="📚"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penerima Manfaat</label>
          <input
            value={form.beneficiaries}
            onChange={(e) => setForm({ ...form, beneficiaries: e.target.value })}
            placeholder="100+ anak binaan"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Jakarta Timur"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full text-sm" />
          {imageUrl && <img src={imageUrl} alt="" className="mt-2 h-24 object-cover rounded" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konten (opsional)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
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
          <button type="button" onClick={() => navigate('/program')} className="px-4 py-2 border rounded-lg">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
