import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getPrograms, getStrapiMedia } from '../services/api';
import { truncateText } from '../utils/helpers';

// Fallback data program Yakapetra
const FALLBACK_PROGRAMS = [
  {
    id: 1,
    attributes: {
      title: 'Bimbingan Pendidikan Anak Binaan',
      slug: 'bimbingan-pendidikan',
      description: 'Program bimbingan belajar dan pendampingan akademik bagi anak-anak binaan Yakapetra. Mencakup tutoring, mentoring, dan kegiatan belajar kreatif yang membangun semangat belajar anak.',
      icon: '📚',
      beneficiaries: '100+ anak binaan',
      location: 'Klender, Jakarta Timur',
    },
  },
  {
    id: 2,
    attributes: {
      title: 'Hari Anak Nasional 2025',
      slug: 'hari-anak-nasional-2025',
      description: 'Program bimbingan dan perayaan khusus dalam rangka Hari Anak Nasional 2025. Kegiatan ini dirancang untuk merayakan, mengapresiasi, dan menginspirasi anak-anak binaan Yakapetra.',
      icon: '🎉',
      beneficiaries: 'Seluruh anak binaan',
      location: 'Jakarta Timur',
    },
  },
  {
    id: 3,
    attributes: {
      title: 'Pembinaan Karakter & Kerohanian',
      slug: 'pembinaan-karakter',
      description: 'Pembinaan nilai-nilai karakter mulia dan kerohanian bagi anak-anak binaan. Program ini bertujuan membentuk pribadi yang berintegritas, bertanggung jawab, dan beriman.',
      icon: '✝️',
      beneficiaries: '100+ anak binaan',
      location: 'Klender, Jakarta Timur',
    },
  },
  {
    id: 4,
    attributes: {
      title: 'Pengembangan Bakat & Kreativitas',
      slug: 'pengembangan-bakat',
      description: 'Menggali dan mengembangkan potensi anak-anak binaan melalui kegiatan seni, olahraga, musik, dan keterampilan kreatif. Setiap anak memiliki bakat yang layak dikembangkan.',
      icon: '🎨',
      beneficiaries: '100+ anak binaan',
      location: 'Jakarta Timur',
    },
  },
  {
    id: 5,
    attributes: {
      title: 'Pendampingan Sosial & Keluarga',
      slug: 'pendampingan-sosial',
      description: 'Program pendampingan dan konseling bagi anak binaan dan keluarganya. Yakapetra hadir bukan hanya untuk anak, tetapi juga mendukung keluarga agar tumbuh bersama.',
      icon: '🏘️',
      beneficiaries: 'Anak & keluarga binaan',
      location: 'Jakarta Timur',
    },
  },
  {
    id: 6,
    attributes: {
      title: 'Program Relawan & Mitra',
      slug: 'relawan',
      description: 'Bergabunglah bersama Yakapetra sebagai relawan pengajar, pembina, atau fasilitator. Bersama-sama kita bisa menjadi garam dan terang dunia bagi generasi penerus.',
      icon: '🤝',
      beneficiaries: '50+ relawan aktif',
      location: 'Jakarta Timur',
    },
  },
];

const ProgramCard = ({ program }) => {
  const { title, slug, description, icon, beneficiaries, location, image } = program.attributes;
  const imageUrl = getStrapiMedia(image?.data?.attributes?.url);

  return (
    <Card hoverable padding="none" className="overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          : <span className="text-6xl">{icon}</span>
        }
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
          {truncateText(description, 140)}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
          {beneficiaries && (
            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full">👥 {beneficiaries}</span>
          )}
          {location && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📍 {location}</span>
          )}
        </div>
        <Link
          to={`/program/${slug}`}
          className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Detail Program <FiArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
};

const ProgramsPage = () => {
  const { data, loading, error, refetch } = useFetch(getPrograms);
  const programs = data?.data?.length ? data.data : FALLBACK_PROGRAMS;

  return (
    <>
      <title>Program | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
        <div className="container-custom text-center text-white">
          <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Program Yakapetra</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Program & Kegiatan</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Setiap program Yakapetra dirancang untuk membimbing, mendampingi, dan mentransformasi 
            anak-anak binaan menjadi generasi penerus yang berkarakter dan berdampak.
          </p>
        </div>
      </section>

      {/* Daftar Program */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeader
            title="Semua Program"
            subtitle={`${programs.length} program aktif yang sedang berjalan.`}
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
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;
