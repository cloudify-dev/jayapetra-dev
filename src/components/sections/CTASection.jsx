import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../../services/api';

const CTASection = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const ctaCopy = settings?.ctaCopy || 'Mari Berkolaborasi';

  return (
  <section className="section-padding bg-red-50">
    <div className="container-custom">
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden border border-primary-600">

        {/* Dekorasi */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <FiUsers size={14} /> {ctaCopy}
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Jadilah Garam dan Terang Bersama Kami
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            Ada banyak cara untuk berkontribusi bersama Yakapetra — menjadi relawan pembina, 
            mitra program, atau sekadar menyebarkan semangat kasih. Bersama, kita bisa 
            mentransformasi lebih banyak anak binaan.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/kontak"
              className="bg-white text-primary-700 font-semibold px-7 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              Hubungi Kami <FiArrowRight size={16} />
            </Link>
            <Link
              to="/program"
              className="border-2 border-white text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/15 transition-colors"
            >
              Lihat Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default CTASection;
