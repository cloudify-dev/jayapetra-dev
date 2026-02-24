import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import useFetch from '../../hooks/useFetch';
import { getPrograms } from '../../services/api';
import { truncateText } from '../../utils/helpers';

// Data fallback saat API belum tersedia
const FALLBACK_PROGRAMS = [
  {
    id: 1,
    attributes: {
      title: 'Bimbingan Pendidikan Anak Binaan',
      slug: 'bimbingan-pendidikan',
      description: 'Program bimbingan belajar dan pendampingan akademik kepada anak-anak binaan Yakapetra, termasuk kegiatan khusus dalam rangka Hari Anak Nasional 2025.',
      icon: '📚',
      color: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
    },
  },
  {
    id: 2,
    attributes: {
      title: 'Pembinaan Karakter & Rohani',
      slug: 'pembinaan-karakter',
      description: 'Pembinaan karakter, nilai-nilai kehidupan, dan kerohanian bagi anak-anak binaan agar bertumbuh menjadi pribadi yang berintegritas dan berdampak.',
      icon: '✝️',
      color: 'bg-yellow-50 border-yellow-100',
      iconBg: 'bg-yellow-100',
    },
  },
  {
    id: 3,
    attributes: {
      title: 'Pengembangan Bakat & Kreativitas',
      slug: 'pengembangan-bakat',
      description: 'Menggali dan mengembangkan potensi serta bakat anak-anak binaan melalui kegiatan seni, olahraga, dan keterampilan kreatif yang menyenangkan.',
      icon: '🎨',
      color: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
    },
  },
];

const ProgramCard = ({ program }) => {
  const { title, slug, description, icon, color, iconBg } = program.attributes;

  return (
    <Card hoverable padding="none" className={`border ${color} overflow-hidden`}>
      <Link to={`/program/${slug}`} className="block p-6">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
          {icon}
        </div>
        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{truncateText(description, 110)}</p>
        <span className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
          Selengkapnya <FiArrowRight size={14} />
        </span>
      </Link>
    </Card>
  );
};

const ProgramSection = () => {
  const { data, loading, error, refetch } = useFetch(getPrograms);

  // Gunakan data dari API jika tersedia, fallback ke data statis
  const programs = data?.data?.length ? data.data : FALLBACK_PROGRAMS;

  return (
    <section className="section-padding bg-red-50/40">
      <div className="container-custom">
        <SectionHeader
          tag="Program Yakapetra"
          title="Program Unggulan Kami"
          subtitle="Setiap program dirancang untuk membimbing dan mentransformasi anak-anak binaan menjadi generasi yang berdampak."
        />

        {loading && <Loading />}
        {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/program" className="btn-outline">
            Lihat Semua Program
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
