import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionHeader from '../components/ui/SectionHeader';
import Loading from '../components/ui/Loading';
import useFetch from '../hooks/useFetch';
import { getGalleries, getStrapiMedia } from '../services/api';

const GalleryPage = () => {
  const { data, loading, error } = useFetch(getGalleries);
  const [selected, setSelected] = useState(null);

  const openLightbox = (item) => setSelected(item);
  const closeLightbox = () => setSelected(null);

  const list = data?.data ?? [];
  const galleries = Array.isArray(list)
    ? list.map((g) => {
        const imgs = g.attributes?.images?.data ?? g.images ?? [];
        const imageUrls = imgs.map((d) => getStrapiMedia(d?.attributes?.url ?? d?.url)).filter(Boolean);
        return {
          id: g.id ?? g.documentId,
          title: g.attributes?.title ?? g.title ?? 'Galeri',
          imageUrl: imageUrls[0] ?? null,
          imageUrls,
          color: 'from-gray-100 to-gray-200',
          emoji: '🖼️',
        };
      })
    : [];

  const goNext = () => {
    if (galleries.length === 0) return;
    const idx = galleries.findIndex((g) => g.id === selected?.id);
    if (idx >= 0) setSelected(galleries[(idx + 1) % galleries.length]);
  };
  const goPrev = () => {
    if (galleries.length === 0) return;
    const idx = galleries.findIndex((g) => g.id === selected?.id);
    if (idx >= 0) setSelected(galleries[(idx - 1 + galleries.length) % galleries.length]);
  };

  return (
    <>
      <title>Galeri | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
        <div className="container-custom text-center text-white">
          <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Galeri</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Galeri Kegiatan</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Momen-momen berharga dari berbagai kegiatan dan program yayasan kami.
          </p>
        </div>
      </section>

      {/* Grid Galeri */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionHeader title="Dokumentasi Kegiatan" />

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-center py-12 text-gray-500">
              <p>Gagal memuat galeri. Pastikan backend berjalan.</p>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-3">🖼️</p>
              <p>Belum ada foto galeri. Album yang sudah diterbitkan akan tampil di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  className="group relative aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl`}>
                      {item.emoji}
                    </div>
                  )}
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                    <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={closeLightbox}
          >
            <FiX size={28} />
          </button>
          <button
            className="absolute left-4 text-white hover:text-gray-300 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <FiChevronLeft size={36} />
          </button>
          <div
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.imageUrl ? (
              <img src={selected.imageUrl} alt={selected.title} className="w-full rounded-xl" />
            ) : (
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${selected.color} flex flex-col items-center justify-center gap-4`}>
                <span className="text-8xl">{selected.emoji}</span>
                <p className="text-gray-700 font-medium">{selected.title}</p>
              </div>
            )}
            <p className="text-white text-center mt-3 font-medium">{selected.title}</p>
          </div>
          <button
            className="absolute right-4 text-white hover:text-gray-300 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <FiChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
