/**
 * Komponen kartu serbaguna.
 * Props:
 *   - hoverable: boolean - aktifkan efek hover lift
 *   - padding:   'none' | 'sm' | 'md' | 'lg'
 */
const Card = ({ children, hoverable = false, padding = 'md', className = '' }) => {
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md border border-gray-100
        ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
