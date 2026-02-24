import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../../services/api';

// Daftar navigasi utama
const NAV_LINKS = [
  { label: 'Beranda',     to: '/'          },
  { label: 'Tentang',     to: '/tentang'   },
  { label: 'Program',     to: '/program'   },
  { label: 'Galeri',      to: '/galeri'    },
  { label: 'Kontak',      to: '/kontak'    },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });
  const ctaLabel = settings?.ctaCopy || 'Mari Berkolaborasi';

  // Tutup menu saat navigasi berpindah
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Ubah tampilan navbar saat di-scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom px-4 md:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo-yakapetra.png"
              alt="Logo Yakapetra"
              className="h-11 w-11 object-contain flex-shrink-0"
            />
            <div>
              <p className="font-heading font-bold text-primary-700 leading-tight text-sm">
                Yakapetra
              </p>
              <p className="text-xs text-gray-500 leading-tight">Kasih Penerus Transformasi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button (desktop) */}
          <div className="hidden md:block">
            <Link
              to="/kontak"
              className="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm shadow-primary-200"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container-custom px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/kontak"
              className="mt-3 btn-primary text-center text-sm"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
