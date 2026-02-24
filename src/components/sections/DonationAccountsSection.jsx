import { useState } from 'react';
import { FiCreditCard, FiCopy, FiCheck } from 'react-icons/fi';
import SectionHeader from '../ui/SectionHeader';
import Loading from '../ui/Loading';
import useFetch from '../../hooks/useFetch';
import { getDonationAccounts } from '../../services/api';
import { getBankByCode } from '../../constants/banks';

const DonationAccountCard = ({ acc }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const bank = getBankByCode(acc.bankCode);
  const showLogo = bank?.logoUrl && !imgError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(acc.accountNo.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select and copy not supported in some contexts
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      {/* Accent strip */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary-500 to-primary-700" />

      <div className="pl-6 pr-6 py-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
            {showLogo ? (
              <img
                src={bank.logoUrl}
                alt={acc.bankName}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-primary-600">
                <FiCreditCard size={28} />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-primary-700 text-lg mb-1">{acc.bankName}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-gray-900 font-mono font-semibold text-xl tracking-wide select-all">
                {acc.accountNo}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                title="Salin nomor rekening"
              >
                {copied ? <FiCheck size={18} className="text-green-600" /> : <FiCopy size={18} />}
              </button>
            </div>
            <p className="text-gray-600 font-medium mt-2 text-sm">a.n. {acc.accountName}</p>
            {acc.description && (
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{acc.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DonationAccountsSection = ({ variant = 'default' }) => {
  const { data, loading, error } = useFetch(getDonationAccounts);
  const accounts = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const isCompact = variant === 'compact';

  return (
    <section className={isCompact ? 'section-padding bg-gray-50' : 'section-padding bg-gradient-to-b from-primary-50/50 to-white'}>
      <div className="container-custom">
        <SectionHeader
          tag="Donasi"
          title="Rekening Penyaluran Donasi"
          subtitle="Transfer ke rekening resmi yayasan. Setiap donasi akan disalurkan untuk program sosial dan pendidikan."
          center={!isCompact}
        />

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Rekening donasi tidak dapat dimuat. Pastikan backend berjalan.
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/60 rounded-2xl border border-gray-100">
            <FiCreditCard className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-600 font-medium">Belum ada rekening donasi</p>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              Rekening akan tampil di sini setelah diisi dari Admin CMS (Rekening Donasi).
            </p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${isCompact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {accounts.map((acc) => (
                <DonationAccountCard key={acc.id} acc={acc} />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Konfirmasi donasi dapat dilakukan melalui WhatsApp kami.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default DonationAccountsSection;
