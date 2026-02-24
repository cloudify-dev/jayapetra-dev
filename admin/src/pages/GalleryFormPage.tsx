import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { galleriesApi, uploadApi } from '../api';

export default function GalleryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', imageIds: [] as string[] });
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      galleriesApi
        .get(id)
        .then(({ data }) => {
          setForm({
            title: data.title,
            description: data.description || '',
            eventDate: data.eventDate ? data.eventDate.slice(0, 10) : '',
            imageIds: data.images?.map((i: { id: string }) => i.id) || [],
          });
          setImages(data.images || []);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const ids: string[] = [];
    const urls: { id: string; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      const { data } = await uploadApi.file(fd);
      ids.push(data.data.id);
      urls.push({ id: data.data.id, url: data.data.url });
    }
    setForm((f) => ({ ...f, imageIds: [...f.imageIds, ...ids] }));
    setImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, imageIds: f.imageIds.filter((_, i) => i !== idx) }));
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        eventDate: form.eventDate || null,
        imageIds: form.imageIds,
      };
      if (isNew) {
        await galleriesApi.create(payload);
      } else if (id) {
        await galleriesApi.update(id, payload);
      }
      navigate('/galeri');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) return <div className="p-12 text-center">Memuat...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isNew ? 'Tambah Galeri' : 'Edit Galeri'}</h1>
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
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto (bisa banyak)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="w-full text-sm"
          />
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt="" className="h-20 w-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/galeri')} className="px-4 py-2 border rounded-lg">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
