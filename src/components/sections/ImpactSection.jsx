import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../ui/SectionHeader';

const stats = [
  { number: 20,   suffix: '+', label: 'Tahun Pelayanan',    desc: 'Konsisten melayani sejak 2004',         color: 'text-white' },
  { number: 100,  suffix: '+', label: 'Anak Binaan',        desc: 'Dibimbing & didampingi Yakapetra',      color: 'text-white' },
  { number: 50,   suffix: '+', label: 'Relawan Aktif',      desc: 'Pembina, pengajar & fasilitator',       color: 'text-white' },
  { number: 2025, suffix: '',  label: 'Hari Anak Nasional', desc: 'Program khusus bimbingan anak binaan',  color: 'text-red-200' },
];

// Hook untuk animasi counter angka
const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
};

const StatCard = ({ stat, animate }) => {
  const count = useCountUp(stat.number, 2000, animate);

  return (
    <div className="text-center p-6">
      <p className={`font-heading font-bold text-5xl ${stat.color} mb-2`}>
        {count.toLocaleString('id-ID')}{stat.suffix}
      </p>
      <p className="font-semibold text-white text-lg mb-1">{stat.label}</p>
      <p className="text-red-200 text-sm">{stat.desc}</p>
    </div>
  );
};

const ImpactSection = () => {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  // Mulai animasi saat section masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-primary-800 to-primary-900 relative overflow-hidden">
      {/* Pattern dekorasi merah putih */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />
      <div className="container-custom">
        <div className="mb-12 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">
            Dampak Nyata
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Angka yang Berbicara</h2>
          <p className="text-red-200 text-lg max-w-2xl mx-auto">
            Setiap angka mewakili perubahan nyata dalam kehidupan seseorang.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 divide-y-2 divide-x-0 lg:divide-x-2 lg:divide-y-0 divide-white/10 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={{ ...stat, color: 'text-white' }} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
