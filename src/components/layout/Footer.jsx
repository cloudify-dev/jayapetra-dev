import { Link } from 'react-router-dom';
import { FiHeart, FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../../services/api';

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });
  const footerText = settings?.footerText;
  const tagline = settings?.tagline || 'Menjadi Garam dan Terang Dunia';

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo-yakapetra.png"
                alt="Logo Yakapetra"
                className="h-14 w-14 object-contain flex-shrink-0 bg-white rounded-lg p-1"
              />
              <div>
                <p className="font-heading font-bold text-white text-base leading-tight">
                  Yayasan Kasih Penerus Transformasi
                </p>
                <p className="text-xs text-primary-300 mt-0.5">Yakapetra — {tagline}</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              {footerText || 'Yakapetra bergerak di bidang sosial dan pendidikan, memberikan bimbingan dan pembinaan kepada anak-anak binaan untuk bertumbuh menjadi generasi yang berdampak bagi sesama.'}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FiFacebook,  href: '#', label: 'Facebook'  },
                { Icon: FiInstagram, href: '#', label: 'Instagram' },
                { Icon: FiYoutube,   href: '#', label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Beranda',          to: '/'        },
                { label: 'Tentang Kami',     to: '/tentang' },
                { label: 'Program Kami',     to: '/program' },
                { label: 'Galeri',           to: '/galeri'  },
                { label: 'Kontak',           to: '/kontak'  },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-400">
                  Jl. I Gusti Ngurah Rai Blok B3 No. 21, Klender, Duren Sawit, Jakarta Timur
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="text-primary-400 mt-0.5 flex-shrink-0" size={16} />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+6282219992336" className="text-gray-400 hover:text-primary-400 transition-colors">
                    0822-1999-2336
                  </a>
                  <a href="tel:+6285287402336" className="text-gray-400 hover:text-primary-400 transition-colors">
                    0852-8740-2336
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-400 flex-shrink-0" size={16} />
                <a href="mailto:yakapetra2504@gmail.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  yakapetra2504@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} Yayasan Kasih Penerus Transformasi (Yakapetra). All rights reserved.</p>
          <p>
            Dibuat dengan <FiHeart className="inline text-red-400 mx-1" size={12} /> untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
