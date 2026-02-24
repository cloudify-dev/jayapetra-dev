import SectionHeader from '../ui/SectionHeader';
import Loading from '../ui/Loading';
import useFetch from '../../hooks/useFetch';
import { getBoardMembers } from '../../services/api';

const BoardMembersSection = () => {
  const { data, loading } = useFetch(getBoardMembers);
  const members = Array.isArray(data?.data) ? data.data : [];

  if (loading) return <section className="section-padding bg-white"><Loading /></section>;
  if (members.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom">
        <SectionHeader title="Pengurus Yayasan" subtitle="Tim yang mengelola Yakapetra" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] bg-gray-100 flex-shrink-0">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-200 text-6xl font-heading font-bold">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1">{m.name}</h3>
                <p className="text-primary-600 font-semibold text-sm mb-3">{m.position}</p>
                {m.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{m.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardMembersSection;
