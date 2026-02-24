import { useState } from 'react';
import { FiSave, FiInfo } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';

/**
 * Halaman edit informasi Tentang Kami.
 * Data ini bersifat statis dan bisa dikembangkan 
 * untuk terhubung ke Strapi Single Type "about-page".
 */
const AboutFormPage = () => {
  const [form, setForm] = useState({
    vision:  'Menjadi Garam dan Terang Dunia',
    mission: 'Memberikan bimbingan kepada anak binaan dalam rangka hari Anak Nasional 2025, mendampingi dan memberdayakan anak-anak binaan agar bertumbuh menjadi generasi penerus yang berdampak bagi sesama dan bangsa.',
    values:  'Kasih Sayang • Transformasi • Integritas • Kesetiaan • Pengabdian',
    address: 'Jl. I Gusti Ngurah Rai Blok B3 No. 21, Klender, Duren Sawit, Jakarta Timur',
    email:   'yakapetra2504@gmail.com',
    phone1:  '0822-1999-2336',
    phone2:  '0852-8740-2336',
    year:    '2004',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    // Di sini akan dikoneksikan ke Strapi single type "about-page"
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { name: 'vision',  label: 'Visi Yayasan',        type: 'text',     placeholder: 'Menjadi Garam dan Terang Dunia' },
    { name: 'mission', label: 'Misi Yayasan',         type: 'textarea', placeholder: 'Misi yayasan...' },
    { name: 'values',  label: 'Nilai-Nilai Yayasan',  type: 'text',     placeholder: 'Kasih • Kejujuran • ...' },
    { name: 'address', label: 'Alamat Lengkap',       type: 'textarea', placeholder: 'Alamat kantor...' },
    { name: 'email',   label: 'Email',                type: 'email',    placeholder: 'yakapetra@gmail.com' },
    { name: 'phone1',  label: 'Nomor Telepon 1',      type: 'tel',      placeholder: '0822-xxxx-xxxx' },
    { name: 'phone2',  label: 'Nomor Telepon 2',      type: 'tel',      placeholder: '0852-xxxx-xxxx' },
    { name: 'year',    label: 'Tahun Berdiri',        type: 'text',     placeholder: '2004' },
  ];

  return (
    <div>
      <PageHeader title="Tentang Kami" subtitle="Kelola informasi profil yayasan Yakapetra" />

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <FiSave size={14} /> Perubahan berhasil disimpan!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AdminCard title="Informasi Yayasan">
            <div className="space-y-4">
              {fields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      name={name} value={form[name]} onChange={handleChange}
                      rows={3} placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  ) : (
                    <input
                      type={type} name={name} value={form[name]} onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard title="Simpan Perubahan">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiSave size={15} /> Simpan Perubahan
            </button>
          </AdminCard>

          <AdminCard>
            <div className="flex gap-3">
              <FiInfo className="text-primary-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-gray-500 leading-relaxed">
                Perubahan pada halaman ini akan tercermin di halaman <strong>Tentang Kami</strong> di website publik setelah Anda klik Simpan.
              </p>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default AboutFormPage;
