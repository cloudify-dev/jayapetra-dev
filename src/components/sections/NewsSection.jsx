import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiTag } from 'react-icons/fi';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import useFetch from '../../hooks/useFetch';
import { getArticles, getStrapiMedia } from '../../services/api';
import { formatDate, truncateText } from '../../utils/helpers';

// Fallback data artikel saat API belum tersedia
const FALLBACK_ARTICLES = [
  {
    id: 1,
    attributes: {
      title: 'Yakapetra Gelar Program Bimbingan Hari Anak Nasional 2025',
      slug: 'program-hari-anak-nasional-2025',
      excerpt: 'Yayasan Kasih Penerus Transformasi (Yakapetra) menggelar program bimbingan khusus bagi anak-anak binaan dalam rangka memperingati Hari Anak Nasional 2025.',
      publishedAt: '2025-07-10T08:00:00.000Z',
      category: { data: { attributes: { name: 'Pendidikan' } } },
      thumbnail: { data: null },
    },
  },
  {
    id: 2,
    attributes: {
      title: 'Pembinaan Karakter: Menjadi Garam dan Terang Dunia',
      slug: 'pembinaan-karakter-garam-terang',
      excerpt: 'Yakapetra mengadakan sesi pembinaan karakter dan kerohanian bagi anak-anak binaan dengan tema "Menjadi Garam dan Terang Dunia" — visi utama yayasan.',
      publishedAt: '2025-06-05T08:00:00.000Z',
      category: { data: { attributes: { name: 'Pembinaan' } } },
      thumbnail: { data: null },
    },
  },
  {
    id: 3,
    attributes: {
      title: 'Anak Binaan Yakapetra Tampil di Pentas Seni Tahunan',
      slug: 'pentas-seni-anak-binaan',
      excerpt: 'Puluhan anak binaan Yakapetra unjuk bakat di pentas seni tahunan, menampilkan berbagai pertunjukan mulai dari tari, musik, hingga drama yang memukau.',
      publishedAt: '2025-05-20T08:00:00.000Z',
      category: { data: { attributes: { name: 'Kegiatan' } } },
      thumbnail: { data: null },
    },
  },
];

const ArticleCard = ({ article }) => {
  const { title, slug, excerpt, publishedAt, category, thumbnail } = article.attributes;
  const imageUrl = getStrapiMedia(thumbnail?.data?.attributes?.url);
  const categoryName = category?.data?.attributes?.name;

  return (
    <Card hoverable padding="none" className="overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">📰</span>
          </div>
        )}
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-1">
        {categoryName && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full w-fit mb-3">
            <FiTag size={11} /> {categoryName}
          </span>
        )}
        <h3 className="font-heading font-semibold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
          {truncateText(excerpt, 100)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiCalendar size={12} /> {formatDate(publishedAt)}
          </span>
          <Link
            to={`/berita/${slug}`}
            className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Baca <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Card>
  );
};

const NewsSection = () => {
  const { data, loading } = useFetch(() => getArticles({ 'pagination[limit]': 3 }));
  const articles = data?.data?.length ? data.data : FALLBACK_ARTICLES;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          tag="Berita & Artikel"
          title="Kabar Terbaru dari Kami"
          subtitle="Ikuti perkembangan kegiatan dan dampak program yayasan kami."
        />

        {loading ? (
          <Loading />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/berita" className="btn-outline">
            Semua Berita <FiArrowRight size={16} className="inline ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
