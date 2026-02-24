import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiX, FiEye } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import {
  getGalleryBackend,
  createGalleryBackend,
  updateGalleryBackend,
  publishGalleryBackend,
  uploadFileBackend,
} from '../services/backendAdminApi';
import { IMAGE_UPLOAD, validateImageFile } from '../../constants/upload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const imageUrl = (img) => (img?.url?.startsWith('http') ? img.url : img?.url ? `${API_URL}${img.url}` : null);

const GalleryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'baru';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedIds, setUploadedIds] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setLoadingEdit(true);
    getGalleryBackend(id)
      .then((res) => {
        const g = res.data;
        setTitle(g.title ?? '');
        setDescription(g.description ?? '');
        const imgs = g.images ?? [];
        setUploadedIds(imgs.map((i) => i.id));
        setPreviews(imgs.map((i) => ({ id: i.id, url: imageUrl(i), name: '' })));
      })
      .catch(() => setError('Gagal memuat album.'))
      .finally(() => setLoadingEdit(false));
  }, [id, isEdit]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setError('');
    for (const file of files) {
      const check = validateImageFile(file);
      if (!check.valid) {
        setError(check.message);
        e.target.value = '';
        return;
      }
    }
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append(IMAGE_UPLOAD.fieldName, file);
        const { data } = await uploadFileBackend(fd);
        const uploaded = data?.data ?? data;
        const fid = uploaded.id;
        setUploadedIds((prev) => [...prev, fid]);
        const url = uploaded.url || `${API_URL}/uploads/${uploaded.filename}`;
        setPreviews((prev) => [...prev, { id: fid, url, name: file.name }]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal upload foto. Pastikan backend berjalan dan ikuti aturan ukuran/format.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePreview = (imgId) => {
    setUploadedIds((prev) => prev.filter((i) => i !== imgId));
    setPreviews((prev) => prev.filter((p) => p.id !== imgId));
  };

  const handleSave = async (andPublish = false) => {
    if (!title.trim()) { setError('Nama album wajib diisi.'); return; }
    if (uploadedIds.length === 0 && !isEdit) { setError('Upload minimal 1 foto.'); return; }
    setSaving(true);
    setError('');
    try {
      const imageIds = uploadedIds.map((x) => (typeof x === 'string' ? parseInt(x, 10) : x));
      let savedId = id;
      if (isEdit) {
        await updateGalleryBackend(id, { title, description, imageIds });
      } else {
        const { data } = await createGalleryBackend({ title, description, imageIds });
        savedId = data.id;
      }
      if (andPublish && savedId) await publishGalleryBackend(savedId);
      setSuccess(andPublish ? 'Album berhasil disimpan dan ditayangkan!' : 'Album disimpan sebagai draft.');
      setTimeout(() => navigate('/admin/galeri'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyimpan album.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Album' : 'Tambah Album Baru'} subtitle="Upload foto-foto kegiatan Yakapetra">
        <Link to="/admin/galeri" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiArrowLeft size={14} /> Kembali
        </Link>
      </PageHeader>

      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

      {loadingEdit ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Info Album */}
          <AdminCard title="Informasi Album">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Album <span className="text-red-500">*</span>
                </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kegiatan Hari Anak Nasional 2025"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan (opsional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={2} placeholder="Ceritakan sedikit tentang momen ini..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
          </AdminCard>

          {/* Upload Foto */}
          <AdminCard title="Upload Foto">
            {/* Rekomendasi upload — agar tidak salah format/ukuran */}
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-semibold text-amber-800 mb-2">Rekomendasi upload</p>
              <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                <li><strong>Format:</strong> JPG, PNG, GIF, atau WebP (bukan PDF/DOC/HEIC)</li>
                <li><strong>Ukuran:</strong> Maksimal {IMAGE_UPLOAD.maxSizeLabel} per file</li>
                <li>Bisa pilih banyak foto sekaligus; setiap file akan dicek sebelum diunggah</li>
              </ul>
            </div>

            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-red-50/30 transition-colors mb-4">
              <FiUpload className="mx-auto text-gray-400 mb-2" size={28} />
              <p className="text-sm text-gray-600 font-medium">Klik untuk pilih foto</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — maks. {IMAGE_UPLOAD.maxSizeLabel} per foto</p>
              <input
                type="file"
                multiple
                accept={IMAGE_UPLOAD.accept}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-primary-600 mb-3">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Mengupload foto...
              </div>
            )}

            {/* Preview grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePreview(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        <div>
          <AdminCard title="Simpan Album">
            <div className="space-y-2">
              <button onClick={() => handleSave(true)} disabled={saving || uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60">
                <FiEye size={15} /> {saving ? 'Menyimpan...' : 'Simpan & Tayangkan'}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving || uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60">
                Simpan Draft
              </button>
              {uploading && <p className="text-xs text-gray-400 text-center">Tunggu upload selesai...</p>}
            </div>
          </AdminCard>
        </div>
      </div>
      )}
    </div>
  );
};

export default GalleryFormPage;
