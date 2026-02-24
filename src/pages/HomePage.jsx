import HeroSection       from '../components/sections/HeroSection';
import ProgramSection    from '../components/sections/ProgramSection';
import ImpactSection     from '../components/sections/ImpactSection';
import GalleryPreviewSection from '../components/sections/GalleryPreviewSection';
import BoardMembersSection   from '../components/sections/BoardMembersSection';
import DonationAccountsSection from '../components/sections/DonationAccountsSection';
import CTASection        from '../components/sections/CTASection';

/**
 * Halaman Beranda — titik masuk utama website.
 * Semua konten dinamis dari CMS.
 */
const HomePage = () => (
  <>
    <title>Beranda | Yakapetra — Yayasan Kasih Penerus Transformasi</title>
    <HeroSection            />
    <ProgramSection         />
    <ImpactSection          />
    <GalleryPreviewSection  />
    <BoardMembersSection   />
    <DonationAccountsSection />
    <CTASection             />
  </>
);

export default HomePage;
