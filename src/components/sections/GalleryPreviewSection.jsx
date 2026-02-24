import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../ui/SectionHeader';
import Loading from '../ui/Loading';
import useFetch from '../../hooks/useFetch';
import { getGalleries, getStrapiMedia } from '../../services/api';

const GalleryPreviewSection = () => {
  const { data, loading } = useFetch(getGalleries);
  const list = data?.data ?? [];
  const preview = Array.isArray(list) ? list.slice(0, 3) : [];

  const items = preview.map((g) => {
    const imgs = g.attributes?.images?.data ?? g.images ?? [];
    const url = imgs[0]?.attributes?.url ?? imgs[0]?.url;
    return {
      id: g.id ?? g.documentId,
      title: g.attributes?.title ?? g.title ?? 'Galeri',
      imageUrl: getStrapiMedia(url),
    };
  });

  if (loading) return <section className="section-padding bg-white"><Loading /></section>;
  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeader title="Galeri" subtitle="Momen kegiatan yayasan" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🖼️</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/galeri" className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Lihat Selengkapnya <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreviewSection;
