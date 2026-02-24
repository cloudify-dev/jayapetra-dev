import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiLayers, FiImage, FiMail, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import { getDashboardStatsBackend } from '../services/backendAdminApi';

const STAT_CARDS = [
  { key: 'articles',  label: 'Artikel & Berita', icon: FiFileText, to: '/admin/artikel',  color: 'bg-blue-50 text-blue-600' },
  { key: 'programs',  label: 'Program',           icon: FiLayers,   to: '/admin/program',  color: 'bg-green-50 text-green-600' },
  { key: 'galleries', label: 'Galeri Foto',       icon: FiImage,    to: '/admin/galeri',   color: 'bg-purple-50 text-purple-600' },
  { key: 'contacts',  label: 'Pesan Masuk',       icon: FiMail,     to: '/admin/pesan',    color: 'bg-orange-50 text-orange-600' },
];

const QUICK_LINKS = [
  { label: 'Tulis Artikel Baru',    to: '/admin/artikel/baru',  icon: FiFileText },
  { label: 'Tambah Program',        to: '/admin/program/baru',  icon: FiLayers   },
  { label: 'Upload Foto Galeri',    to: '/admin/galeri/baru',   icon: FiImage    },
  { label: 'Lihat Pesan Kontak',    to: '/admin/pesan',         icon: FiMail     },
];

const DashboardPage = () => {
  const [stats,   setStats]   = useState({ articles: 0, programs: 0, galleries: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStatsBackend();
      setStats({
        articles: data.articles ?? 0,
        programs: data.programs ?? 0,
        galleries: data.galleries ?? 0,
        contacts: data.contacts ?? 0,
      });
    } catch {
      setStats({ articles: 0, programs: 0, galleries: 0, contacts: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan konten website Yakapetra"
      >
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(({ key, label, icon: Icon, to, color }) => (
          <Link key={key} to={to}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="font-heading font-bold text-2xl text-gray-900">
                {loading ? <span className="text-gray-300">—</span> : stats[key]}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Aksi Cepat */}
        <AdminCard title="Aksi Cepat">
          <div className="space-y-2">
            {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-gray-400 group-hover:text-primary-500" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{label}</span>
                </div>
                <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </AdminCard>

        {/* Info Yayasan */}
        <AdminCard title="Informasi Yayasan">
          <div className="space-y-3 text-sm">
            {[
              { label: 'Nama',    value: 'Yayasan Kasih Penerus Transformasi' },
              { label: 'Singkat', value: 'Yakapetra' },
              { label: 'Visi',    value: 'Menjadi Garam dan Terang Dunia' },
              { label: 'Alamat',  value: 'Jl. I Gusti Ngurah Rai Blok B3 No. 21, Jakarta Timur' },
              { label: 'Email',   value: 'yakapetra2504@gmail.com' },
              { label: 'Telp',    value: '0822-1999-2336 / 0852-8740-2336' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="text-gray-400 w-16 flex-shrink-0">{label}</span>
                <span className="text-gray-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default DashboardPage;
