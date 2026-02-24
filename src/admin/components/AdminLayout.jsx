import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiFileText, FiLayers, FiImage,
  FiMail, FiInfo, FiLogOut, FiMenu, FiX,
  FiHeart, FiExternalLink, FiChevronDown,
  FiSettings, FiCreditCard, FiUsers,
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV = [
  { to: '/admin',               Icon: FiGrid,      label: 'Dashboard',        exact: true },
  { to: '/admin/site-settings', Icon: FiSettings,  label: 'Site Settings'      },
  { to: '/admin/rekening-donasi', Icon: FiCreditCard, label: 'Rekening Donasi' },
  { to: '/admin/pengurus',      Icon: FiUsers,      label: 'Pengurus'           },
  { to: '/admin/artikel',       Icon: FiFileText,   label: 'Artikel'            },
  { to: '/admin/program',       Icon: FiLayers,     label: 'Program'            },
  { to: '/admin/galeri',        Icon: FiImage,     label: 'Galeri'             },
  { to: '/admin/pesan',         Icon: FiMail,      label: 'Pesan Masuk'        },
  { to: '/admin/tentang',       Icon: FiInfo,      label: 'Tentang Kami'        },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-primary-600 text-white shadow-sm'
      : 'text-gray-600 hover:bg-red-50 hover:text-primary-600'
  }`;

/** Isi sidebar — diekstrak ke luar agar tidak rebuild tiap render */
const SidebarContent = ({ onNavClick, onLogout }) => (
  <aside className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <FiHeart className="text-white" size={16} />
      </div>
      <div>
        <p className="font-heading font-bold text-primary-700 text-sm leading-tight">Yakapetra</p>
        <p className="text-[10px] text-gray-400 leading-tight">Panel Admin</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV.map(({ to, Icon, label, exact }) => (
        <NavLink key={to} to={to} end={exact} className={navLinkClass} onClick={onNavClick}>
          <Icon size={17} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    {/* Footer sidebar */}
    <div className="px-3 py-4 border-t border-gray-100 space-y-1">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
      >
        <FiExternalLink size={16} />
        Lihat Website
      </a>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <FiLogOut size={16} />
        Keluar
      </button>
    </div>
  </aside>
);

const AdminLayout = ({ children }) => {
  const { user, logout } = useAdminAuth();
  const navigate          = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-56 flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <SidebarContent onNavClick={() => {}} onLogout={handleLogout} />
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-56 bg-white shadow-xl z-50">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={20} />
            </button>
            <SidebarContent onNavClick={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-400">Selamat datang,</p>
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.firstname} {user?.lastname}
              </p>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                {user?.firstname?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="hidden sm:block text-sm text-gray-700 font-medium">
                {user?.firstname}
              </span>
              <FiChevronDown size={14} className="text-gray-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <p className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">{user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut size={14} /> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
