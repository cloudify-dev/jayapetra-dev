import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiTag } from 'react-icons/fi';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getArticleBySlug, getStrapiMedia } from '../services/api';
import { formatDate } from '../utils/helpers';

const NewsDetailPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => getArticleBySlug(slug), [slug]);

  const article = data?.data?.[0];

  if (loading) return <Loading fullPage />;
  if (error || !article) {
    return (
      <div className="pt-24">
        <ErrorMessage message="Artikel tidak ditemukan." />
        <div className="text-center mt-4">
          <Link to="/berita" className="btn-primary">Kembali ke Berita</Link>
        </div>
      </div>
    );
  }

  const { title, content, publishedAt, category, thumbnail, author } = article.attributes;
  const imageUrl = getStrapiMedia(thumbnail?.data?.attributes?.url);
  const categoryName = category?.data?.attributes?.name;
  const authorName = author?.data?.attributes?.name;

  return (
    <>
      <title>{title} | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

      <article className="section-padding bg-white">
        <div className="container-custom max-w-3xl">

          {/* Back link */}
          <Link to="/berita" className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium mb-6 hover:gap-3 transition-all">
            <FiArrowLeft size={16} /> Kembali ke Berita
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            {categoryName && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                <FiTag size={11} /> {categoryName}
              </span>
            )}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FiCalendar size={12} /> {formatDate(publishedAt)}
            </span>
            {authorName && (
              <span className="text-xs text-gray-400">oleh <strong>{authorName}</strong></span>
            )}
          </div>

          {/* Judul */}
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
            {title}
          </h1>

          {/* Thumbnail */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-72 object-cover rounded-xl mb-8"
            />
          )}

          {/* Konten artikel */}
          {content ? (
            <div
              className="prose prose-lg prose-primary max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
              Konten artikel akan ditampilkan setelah terhubung ke Strapi CMS.
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default NewsDetailPage;
