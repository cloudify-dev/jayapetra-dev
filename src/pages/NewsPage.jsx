import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiTag, FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getArticles, getStrapiMedia } from '../services/api';
import { formatDate, truncateText } from '../utils/helpers';

// Fallback artikel Yakapetra
const FALLBACK_ARTICLES = [
  { id: 1, attributes: { title: 'Yakapetra Gelar Program Bimbingan Hari Anak Nasional 2025', slug: 'program-hari-anak-nasional-2025', excerpt: 'Yakapetra menggelar program bimbingan khusus bagi anak-anak binaan dalam rangka memperingati Hari Anak Nasional 2025.', publishedAt: '2025-07-10T08:00:00.000Z', category: { data: { attributes: { name: 'Pendidikan' } } }, thumbnail: { data: null } } },
  { id: 2, attributes: { title: 'Pembinaan Karakter: Menjadi Garam dan Terang Dunia', slug: 'pembinaan-karakter-garam-terang', excerpt: 'Sesi pembinaan karakter dan kerohanian bagi anak-anak binaan dengan tema visi utama yayasan: Menjadi Garam dan Terang Dunia.', publishedAt: '2025-06-05T08:00:00.000Z', category: { data: { attributes: { name: 'Pembinaan' } } }, thumbnail: { data: null } } },
  { id: 3, attributes: { title: 'Anak Binaan Yakapetra Tampil di Pentas Seni Tahunan', slug: 'pentas-seni-anak-binaan', excerpt: 'Puluhan anak binaan unjuk bakat di pentas seni tahunan, menampilkan tari, musik, hingga drama yang memukau.', publishedAt: '2025-05-20T08:00:00.000Z', category: { data: { attributes: { name: 'Kegiatan' } } }, thumbnail: { data: null } } },
  { id: 4, attributes: { title: 'Workshop Kreativitas Anak Binaan Yakapetra', slug: 'workshop-kreativitas', excerpt: 'Workshop seni dan kreativitas digelar untuk mengembangkan bakat anak-anak binaan sekaligus membangun rasa percaya diri mereka.', publishedAt: '2025-04-15T08:00:00.000Z', category: { data: { attributes: { name: 'Kegiatan' } } }, thumbnail: { data: null } } },
  { id: 5, attributes: { title: '20 Tahun Yakapetra: Melayani dengan Kasih', slug: 'ulang-tahun-20-yakapetra', excerpt: 'Yakapetra merayakan dua dekade pelayanan sosial dan pendidikan. Sebuah perjalanan panjang yang dipenuhi kasih dan dedikasi.', publishedAt: '2025-03-01T08:00:00.000Z', category: { data: { attributes: { name: 'Berita' } } }, thumbnail: { data: null } } },
  { id: 6, attributes: { title: 'Orientasi Anak Binaan Baru Yakapetra 2025', slug: 'orientasi-anak-binaan-2025', excerpt: 'Yakapetra menyambut anak-anak binaan baru dengan kegiatan orientasi penuh kasih untuk memperkenalkan program dan komunitas.', publishedAt: '2025-01-20T08:00:00.000Z', category: { data: { attributes: { name: 'Program' } } }, thumbnail: { data: null } } },
];

const ArticleCard = ({ article }) => {
  const { title, slug, excerpt, publishedAt, category, thumbnail } = article.attributes;
  const imageUrl = getStrapiMedia(thumbnail?.data?.attributes?.url);
  const categoryName = category?.data?.attributes?.name;

  return (
    <Card hoverable padding="none" className="overflow-hidden flex flex-col">
      <div className="h-44 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        }
      </div>
      <div className="p-5 flex flex-col flex-1">
        {categoryName && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full w-fit mb-3">
            <FiTag size={11} /> {categoryName}
          </span>
        )}
        <h3 className="font-heading font-semibold text-gray-900 mb-2 leading-snug">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{truncateText(excerpt, 100)}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiCalendar size={12} /> {formatDate(publishedAt)}
          </span>
          <Link to={`/berita/${slug}`} className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Baca <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Card>
  );
};

const NewsPage = () => {
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useFetch(getArticles);
  const allArticles = data?.data?.length ? data.data : FALLBACK_ARTICLES;

  const filtered = allArticles.filter((a) =>
    a.attributes.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <title>Berita | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
        <div className="container-custom text-center text-white">
          <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Blog & Berita</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Kabar Terbaru</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            Ikuti perkembangan kegiatan, program, dan cerita inspiratif dari yayasan kami.
          </p>
          {/* Search box */}
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berita..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {loading && <Loading />}
          {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  Tidak ada berita dengan kata kunci "<strong>{search}</strong>"
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsPage;
