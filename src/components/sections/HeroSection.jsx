import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../../services/api';

const HeroSection = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const tagline = settings?.tagline || 'Menjadi Garam dan Terang Dunia';
  const heroText = settings?.heroText || 'Kasih yang Mentransformasi';

  return (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">

    {/* Dekoratif latar belakang */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
      <div className="absolute bottom-10 -left-16 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary-800/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
      />
    </div>

    <div className="container-custom px-4 md:px-8 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center py-20">

        {/* Teks */}
        <div>
          <span className="inline-block bg-white/20 text-white border border-white/30 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✝️ {tagline}
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            {heroText}
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-2 max-w-lg font-semibold">
            Yayasan Kasih Penerus Transformasi
          </p>
          <p className="text-primary-100 text-base leading-relaxed mb-8 max-w-lg">
            Yakapetra hadir untuk membimbing, mendampingi, dan memberdayakan anak-anak binaan 
            agar bertumbuh menjadi generasi penerus yang berdampak bagi sesama dan bangsa.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/program" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 shadow-lg">
              Lihat Program <FiArrowRight size={18} />
            </Link>
            <Link to="/tentang" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
              <FiPlay size={16} /> Tentang Kami
            </Link>
          </div>
        </div>

        {/* Logo + Statistik */}
        <div className="flex flex-col items-center gap-6">
          {/* Logo besar di hero */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex items-center justify-center">
            <img
              src="/logo-yakapetra.png"
              alt="Logo Yayasan Kasih Penerus Transformasi"
              className="w-52 h-52 object-contain drop-shadow-2xl"
            />
          </div>

        {/* Statistik Card */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[
            { number: '20+',  label: 'Tahun Pelayanan',   emoji: '🌟' },
            { number: '100+', label: 'Anak Binaan',       emoji: '👧' },
            { number: '50+',  label: 'Relawan Aktif',     emoji: '🤝' },
            { number: '2025', label: 'Hari Anak Nasional',emoji: '🎓' },
          ].map(({ number, label, emoji }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/15 transition-colors"
            >
              <p className="text-2xl mb-1">{emoji}</p>
              <p className="font-heading font-bold text-2xl text-white">{number}</p>
              <p className="text-red-200 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
        </div>

      </div>
    </div>

    {/* Wave bawah */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" className="w-full fill-white">
        <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" />
      </svg>
    </div>
  </section>
  );
};

export default HeroSection;
