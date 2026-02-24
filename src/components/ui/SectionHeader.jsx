/**
 * Header standar untuk setiap section halaman.
 * Props:
 *   - tag:      string - label kecil di atas judul (opsional)
 *   - title:    string - judul utama
 *   - subtitle: string - deskripsi singkat (opsional)
 *   - center:   boolean - rata tengah
 */
const SectionHeader = ({ tag, title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {tag && (
      <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
        {tag}
      </span>
    )}
    <h2 className="section-title">{title}</h2>
    {subtitle && (
      <p className={`section-subtitle text-gray-500 mt-3 ${center ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
