import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import { getSiteSettings } from '../services/api';
import DonationAccountsSection from '../components/sections/DonationAccountsSection';

const WA_BASE = 'https://api.whatsapp.com/send';

const SUBJECT_LABELS = {
  donasi: 'Informasi Donasi',
  relawan: 'Menjadi Relawan',
  beasiswa: 'Program Beasiswa',
  kerjasama: 'Kerjasama / Kemitraan',
  lainnya: 'Lainnya',
};

const INITIAL_FORM = {
  name:    '',
  email:   '',
  phone:   '',
  subject: '',
  message: '',
};

const buildWaMessage = (form) => {
  const subjekLabel = SUBJECT_LABELS[form.subject] || form.subject;
  return [
    'Halo Yayasan,',
    '',
    `*Nama Lengkap:* ${form.name}`,
    `*Alamat Email:* ${form.email}`,
    `*Subjek:* ${subjekLabel}`,
    '',
    '*Pesan:*',
    form.message,
  ].join('\n');
};

const ContactPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const number = (settings?.whatsappNumber || '6285287402336').replace(/\D/g, '');
    const text = buildWaMessage(form);
    const url = `${WA_BASE}?phone=${number}&text=${encodeURIComponent(text)}`;
    setSuccess(true);
    setForm(INITIAL_FORM);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <title>Kontak | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
        <div className="container-custom text-center text-white">
          <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Kontak Kami</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Hubungi Yakapetra</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Ada pertanyaan, ingin berkolaborasi, bergabung sebagai relawan, atau mendaftarkan 
            anak binaan? Kami dengan senang hati mendengar dari Anda.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Info Kontak */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Informasi Kontak</h2>
                <p className="text-gray-500 text-sm">Silakan hubungi kami melalui salah satu saluran di bawah ini.</p>
              </div>

              {[
                { Icon: FiMapPin, title: 'Alamat',    content: 'Jl. I Gusti Ngurah Rai Blok B3 No. 21, Klender, Duren Sawit, Jakarta Timur', color: 'bg-blue-50 text-blue-600' },
                { Icon: FiPhone,  title: 'Telepon',   content: '0822-1999-2336\n0852-8740-2336', color: 'bg-green-50 text-green-600' },
                { Icon: FiMail,   title: 'Email',     content: 'yakapetra2504@gmail.com', color: 'bg-primary-50 text-primary-600' },
              ].map(({ Icon, title, content, color }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{content}</p>
                  </div>
                </div>
              ))}

              {/* Google Maps */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.356117843914!2d106.92818737489247!3d-6.216679993771284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4a03e3196eb%3A0xe7dd7366e5c7401b!2sJl.%20I%20Gusti%20Ngurah%20Rai!5e0!3m2!1sen!2sid!4v1771629913350!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Yakapetra - Jl. I Gusti Ngurah Rai"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-md p-8">
                {success ? (
                  <div className="text-center py-8">
                    <FiCheckCircle className="text-primary-500 mx-auto mb-4" size={56} />
                    <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">Pesan Terkirim!</h3>
                    <p className="text-gray-500 mb-6">
                      Terima kasih telah menghubungi kami. Tim kami akan membalas dalam 1–2 hari kerja.
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="outline">
                      Kirim Pesan Lain
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Kirim Pesan</h2>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text" name="name" value={form.name} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Masukkan nama Anda"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email" name="email" value={form.email} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="contoh@email.com"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                          <input
                            type="tel" name="phone" value={form.phone} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="08xxxxxxxxxx"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subjek <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="subject" value={form.subject} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          >
                            <option value="">Pilih subjek</option>
                            <option value="donasi">Informasi Donasi</option>
                            <option value="relawan">Menjadi Relawan</option>
                            <option value="beasiswa">Program Beasiswa</option>
                            <option value="kerjasama">Kerjasama / Kemitraan</option>
                            <option value="lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pesan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message" value={form.message} onChange={handleChange} required
                          rows={5}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Tuliskan pesan Anda di sini..."
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <FiSend size={16} /> Kirim ke WhatsApp
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rekening Donasi — tampil juga di Kontak */}
      <DonationAccountsSection variant="compact" />
    </>
  );
};

export default ContactPage;
