import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPackage, FiImage, FiMail } from 'react-icons/fi';
import { dashboardApi } from '../api';

const cards = [
  { to: '/artikel', icon: FiFileText, label: 'Artikel', color: 'bg-blue-500' },
  { to: '/program', icon: FiPackage, label: 'Program', color: 'bg-green-500' },
  { to: '/galeri', icon: FiImage, label: 'Galeri', color: 'bg-purple-500' },
  { to: '/pesan', icon: FiMail, label: 'Pesan', color: 'bg-amber-500' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<{ articles: number; programs: number; galleries: number; contacts: number } | null>(null);

  useEffect(() => {
    dashboardApi.stats().then(({ data }) => setStats(data)).catch(() => setStats({ articles: 0, programs: 0, galleries: 0, contacts: 0 }));
  }, []);

  const values = stats ? [stats.articles, stats.programs, stats.galleries, stats.contacts] : [0, 0, 0, 0];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{values[i]}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
