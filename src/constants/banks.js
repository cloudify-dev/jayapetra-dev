/**
 * Daftar bank Indonesia untuk dropdown rekening donasi.
 * bankCode dipakai di backend (donation_accounts.bank_code).
 * logoUrl: gambar logo bank (Wikimedia Commons / CDN).
 */
export const BANKS = [
  { code: 'bca', name: 'BCA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/120px-Bank_Central_Asia.svg.png' },
  { code: 'bni', name: 'BNI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BNI_logo.svg/120px-BNI_logo.svg.png' },
  { code: 'mandiri', name: 'Bank Mandiri', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bank_Mandiri_logo_2016.svg/120px-Bank_Mandiri_logo_2016.svg.png' },
  { code: 'bri', name: 'BRI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bank_Rakyat_Indonesia_%28BRI%29_logo.svg/120px-Bank_Rakyat_Indonesia_%28BRI%29_logo.svg.png' },
  { code: 'cimb', name: 'CIMB Niaga', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/CIMB_Niaga_logo.svg/120px-CIMB_Niaga_logo.svg.png' },
  { code: 'permata', name: 'Bank Permata', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bank_Permata_logo.svg/120px-Bank_Permata_logo.svg.png' },
  { code: 'bsi', name: 'BSI (Bank Syariah Indonesia)', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bank_Syariah_Indonesia_2021.svg/120px-Bank_Syariah_Indonesia_2021.svg.png' },
  { code: 'btn', name: 'BTN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bank_Tabungan_Negara.svg/120px-Bank_Tabungan_Negara.svg.png' },
  { code: 'panin', name: 'Bank Panin', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Panin_Bank_logo.svg/120px-Panin_Bank_logo.svg.png' },
  { code: 'maybank', name: 'Maybank Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Maybank_logo.svg/120px-Maybank_logo.svg.png' },
  { code: 'uob', name: 'UOB Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/UOB_Logo.svg/120px-UOB_Logo.svg.png' },
  { code: 'ocbc', name: 'OCBC NISP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/OCBC_NISP_logo.svg/120px-OCBC_NISP_logo.svg.png' },
  { code: 'danamon', name: 'Bank Danamon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Danamon_logo.svg/120px-Danamon_logo.svg.png' },
  { code: 'bukopin', name: 'Bank Bukopin', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bank_Bukopin.svg/120px-Bank_Bukopin.svg.png' },
  { code: 'other', name: 'Lainnya (ketik manual)', logoUrl: null },
];

/** Ambil info bank dari code; null jika tidak ketemu */
export function getBankByCode(code) {
  if (!code) return null;
  return BANKS.find((b) => b.code === code) || null;
}

export default BANKS;
