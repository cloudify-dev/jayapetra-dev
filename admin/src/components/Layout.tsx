import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiPackage, FiImage, FiMail, FiInfo, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api';

const nav = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/artikel', icon: FiFileText, label: 'Artikel' },
  { to: '/program', icon: FiPackage, label: 'Program' },
  { to: '/galeri', icon: FiImage, label: 'Galeri' },
  { to: '/pesan', icon: FiMail, label: 'Pesan' },
  { to: '/tentang', icon: FiInfo, label: 'Tentang' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-bold text-primary-600">Yakapetra Admin</h1>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <p className="px-3 py-2 text-xs text-gray-500 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <FiLogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
