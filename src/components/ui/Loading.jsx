/**
 * Komponen loading spinner.
 * Props:
 *   - size:    'sm' | 'md' | 'lg'
 *   - fullPage: boolean - tampilkan di tengah layar penuh
 */
const Loading = ({ size = 'md', fullPage = false }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        {spinner}
        <p className="text-gray-500 text-sm">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};

export default Loading;
