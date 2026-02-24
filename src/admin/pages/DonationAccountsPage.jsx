import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminCard from '../components/AdminCard';
import PageHeader from '../components/PageHeader';
import {
  getDonationAccounts,
  createDonationAccount,
  updateDonationAccount,
  deleteDonationAccount,
} from '../services/backendAdminApi';
import { BANKS, getBankByCode } from '../../constants/banks';

const DonationAccountsPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ bankCode: '', bankName: '', accountNo: '', accountName: '', description: '', sortOrder: 0 });
  const [failedLogoBankCodes, setFailedLogoBankCodes] = useState(() => new Set());
  const [selectedBankLogoError, setSelectedBankLogoError] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    getDonationAccounts()
      .then((res) => setList(res.data?.data ?? []))
      .catch((err) => {
        const status = err.response?.status;
        const msg = err.response?.data?.error || err.message;
        if (status === 401) {
          setError('Sesi backend habis atau token tidak valid. Silakan logout lalu login lagi (pastikan backend berjalan di port 4000).');
        } else if (err.code === 'ERR_NETWORK' || !status) {
          setError('Backend tidak terjangkau. Jalankan backend: cd backend && npm run dev');
        } else {
          setError(msg || 'Gagal memuat data.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'sortOrder' ? parseInt(value, 10) || 0 : value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ bankCode: '', bankName: '', accountNo: '', accountName: '', description: '', sortOrder: list.length });
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      bankCode: item.bankCode ?? '',
      bankName: item.bankName ?? '',
      accountNo: item.accountNo ?? '',
      accountName: item.accountName ?? '',
      description: item.description ?? '',
      sortOrder: item.sortOrder ?? 0,
    });
  };

  const handleBankSelect = (e) => {
    const code = e.target.value;
    const bank = BANKS.find((b) => b.code === code);
    setSelectedBankLogoError(false);
    setForm((prev) => ({
      ...prev,
      bankCode: code === 'other' ? '' : code,
      bankName: bank && code !== 'other' ? bank.name : prev.bankName,
    }));
  };

  const markLogoFailed = (bankCode) => {
    if (!bankCode) return;
    setFailedLogoBankCodes((prev) => new Set(prev).add(bankCode));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (editing) {
      updateDonationAccount(editing, form)
        .then(() => { setEditing(null); load(); })
        .catch((err) => setError(err.response?.data?.error || 'Gagal menyimpan'));
    } else {
      createDonationAccount(form)
        .then(() => { setForm({ bankName: '', accountNo: '', accountName: '', description: '', sortOrder: 0 }); load(); })
        .catch((err) => setError(err.response?.data?.error || 'Gagal menambah'));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Hapus rekening ini?')) return;
    deleteDonationAccount(id)
      .then(() => { if (editing === id) setEditing(null); load(); })
      .catch(() => setError('Gagal menghapus'));
  };

  return (
    <div>
      <PageHeader title="Rekening Donasi" subtitle="Kelola rekening penyaluran donasi" />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Daftar Rekening">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {list.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada rekening. Tambah di form sebelah.</p>
              ) : (
                list.map((item) => {
                const bank = getBankByCode(item.bankCode);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {bank?.logoUrl && !failedLogoBankCodes.has(bank.code) ? (
                        <img
                          src={bank.logoUrl}
                          alt={bank.name}
                          className="w-10 h-10 object-contain rounded bg-white border border-gray-100"
                          onError={() => markLogoFailed(bank.code)}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                          {item.bankName?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{item.bankName}</p>
                      <p className="text-sm text-gray-600 font-mono">{item.accountNo} — a.n. {item.accountName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          )}
        </AdminCard>

        <AdminCard title={editing ? 'Edit Rekening' : 'Tambah Rekening'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <select
                value={form.bankCode || (form.bankName ? 'other' : '')}
                onChange={handleBankSelect}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">— Pilih bank —</option>
                {BANKS.filter((b) => b.code !== 'other').map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
                <option value="other">Lainnya (ketik manual)</option>
              </select>
              {!form.bankCode && (
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Nama bank (jika pilih Lainnya)"
                  required
                  className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
              {form.bankCode && (
                <div className="mt-2 flex items-center gap-2">
                  {(() => {
                    const b = getBankByCode(form.bankCode);
                    const showLogo = b?.logoUrl && !selectedBankLogoError;
                    return showLogo ? (
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="h-8 object-contain rounded border border-gray-100"
                        onError={() => setSelectedBankLogoError(true)}
                      />
                    ) : b ? (
                      <div className="w-8 h-8 rounded bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {b.name?.charAt(0) || '?'}
                      </div>
                    ) : null;
                  })()}
                  <span className="text-sm text-gray-600">{form.bankName}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
              <input
                type="text"
                name="accountNo"
                value={form.accountNo}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
              <input
                type="text"
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editing ? 'Simpan' : 'Tambah'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="flex items-center gap-1 text-primary-600 text-sm font-medium"
                >
                  <FiPlus size={14} /> Baru
                </button>
              )}
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
};

export default DonationAccountsPage;
