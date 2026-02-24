import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import { getSiteSettings, updateSiteSettings } from '../services/backendAdminApi';

const SiteSettingsPage = () => {
  const [form, setForm] = useState({
    heroText: '',
    tagline: '',
    footerText: '',
    whatsappNumber: '',
    ctaCopy: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteSettings()
      .then((res) => {
        const d = res.data?.data ?? {};
        setForm({
          heroText: d.heroText ?? '',
          tagline: d.tagline ?? '',
          footerText: d.footerText ?? '',
          whatsappNumber: d.whatsappNumber ?? '',
          ctaCopy: d.ctaCopy ?? 'Mari Berkolaborasi',
        });
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          setError('Sesi backend habis. Logout lalu login lagi (pastikan backend berjalan di port 4000).');
        } else if (err.code === 'ERR_NETWORK' || !status) {
          setError('Backend tidak terjangkau. Jalankan: cd backend && npm run dev');
        } else {
          setError(err.response?.data?.error || 'Gagal memuat pengaturan.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setSaving(true);
    setError('');
    updateSiteSettings(form)
      .then((res) => {
        setForm((prev) => ({ ...prev, ...(res.data?.data ?? {}) }));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch((err) => setError(err.response?.data?.error || 'Gagal menyimpan'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Site Settings" subtitle="Pengaturan umum website" />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Hero, tagline, footer, WhatsApp, dan teks CTA" />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <FiSave size={14} /> Perubahan berhasil disimpan!
        </div>
      )}

      <AdminCard title="Pengaturan Umum">
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Text (judul utama beranda)</label>
            <input
              type="text"
              name="heroText"
              value={form.heroText}
              onChange={handleChange}
              placeholder="Kasih yang Mentransformasi"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Menjadi Garam dan Terang Dunia"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Text (deskripsi di footer)</label>
            <textarea
              name="footerText"
              value={form.footerText}
              onChange={handleChange}
              rows={3}
              placeholder="Yakapetra bergerak di bidang sosial..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp (tanpa +, contoh: 6285287402336)</label>
            <input
              type="text"
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              placeholder="6285287402336"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teks CTA (tombol/navigasi, contoh: Mari Berkolaborasi)</label>
            <input
              type="text"
              name="ctaCopy"
              value={form.ctaCopy}
              onChange={handleChange}
              placeholder="Mari Berkolaborasi"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </AdminCard>
    </div>
  );
};

export default SiteSettingsPage;
