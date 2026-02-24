import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

const TEAM = [
  { name: 'Ketua Yayasan',        role: 'Yakapetra',                initial: 'KY' },
  { name: 'Sekretaris',           role: 'Yayasan Yakapetra',        initial: 'SK' },
  { name: 'Bendahara',            role: 'Yayasan Yakapetra',        initial: 'BD' },
  { name: 'Koordinator Program',  role: 'Pendidikan & Pembinaan',   initial: 'KP' },
];

const MILESTONES = [
  { year: '2004', event: 'Yakapetra (Yayasan Kasih Penerus Transformasi) resmi didirikan dengan semangat menjadi garam dan terang dunia.' },
  { year: '2008', event: 'Program pembinaan anak binaan perdana diluncurkan di wilayah Klender, Duren Sawit, Jakarta Timur.' },
  { year: '2012', event: 'Perluasan program bimbingan pendidikan untuk mendampingi lebih banyak anak binaan.' },
  { year: '2017', event: 'Penguatan jaringan relawan dan pembina dalam mendukung kegiatan sosial dan rohani.' },
  { year: '2022', event: 'Pengembangan program pelatihan karakter dan keterampilan bagi generasi muda binaan Yakapetra.' },
  { year: '2025', event: 'Pelaksanaan program bimbingan anak binaan dalam rangka Hari Anak Nasional 2025.' },
];

const AboutPage = () => (
  <>
    <title>Tentang Kami | Yakapetra — Yayasan Kasih Penerus Transformasi</title>

    {/* Hero */}
    <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 px-4">
      <div className="container-custom text-center text-white">
        <span className="inline-block bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Tentang Kami</span>
        <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2">
          Yayasan Kasih Penerus Transformasi
        </h1>
        <p className="text-red-200 font-semibold text-xl mb-4">Yakapetra</p>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto">
          Kami hadir untuk membimbing dan mendampingi anak-anak binaan, 
          menjadi garam dan terang dunia bagi generasi penerus bangsa.
        </p>
      </div>
    </section>

    {/* Visi, Misi, Nilai */}
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader title="Landasan Kami" subtitle="Prinsip yang membimbing setiap langkah yayasan." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              Icon: FiEye,
              title: 'Visi',
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              content: 'Menjadi Garam dan Terang Dunia — membawa dampak nyata dan transformasi yang berkelanjutan bagi anak-anak binaan dan masyarakat di sekitarnya.',
            },
            {
              Icon: FiTarget,
              title: 'Misi',
              color: 'text-primary-600',
              bg: 'bg-primary-50',
              content: 'Memberikan bimbingan, pendampingan, dan pembinaan kepada anak-anak binaan di bidang pendidikan dan pengembangan karakter, serta mendukung tumbuh kembang mereka secara holistik.',
            },
            {
              Icon: FiHeart,
              title: 'Nilai',
              color: 'text-red-500',
              bg: 'bg-red-50',
              content: 'Kasih Sayang • Transformasi • Integritas • Kesetiaan • Pengabdian. Nilai-nilai inilah yang mendorong setiap langkah pelayanan Yakapetra.',
            },
          ].map(({ Icon, title, color, bg, content }) => (
            <Card key={title} className="text-center">
              <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className={color} size={26} />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{content}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <SectionHeader title="Perjalanan Kami" subtitle="Jejak langkah yayasan dari tahun ke tahun." />
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200" />
          {MILESTONES.map((item, i) => (
            <div key={i} className="flex gap-6 mb-8 relative">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-md">
                {item.year.slice(2)}
              </div>
              <Card padding="sm" className="flex-1 hover:border-primary-200 transition-colors">
                <p className="text-primary-600 text-xs font-semibold mb-1">{item.year}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{item.event}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Tim */}
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader title="Pengurus Yayasan" subtitle="Orang-orang berdedikasi di balik yayasan kami." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {TEAM.map(({ name, role, initial }) => (
            <Card key={name} padding="md" className="text-center hover:border-primary-200 transition-colors">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-3 font-heading font-bold text-xl">
                {initial}
              </div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{name}</p>
              <p className="text-primary-600 text-xs mt-1">{role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;
