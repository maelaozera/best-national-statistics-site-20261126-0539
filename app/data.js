// Dataset Portal Statistik Nusara.
//
// Republik Nusara adalah negara fiktif dan seluruh angka di sini adalah angka
// ilustratif yang disusun agar konsisten antar halaman: jumlah penduduk
// provinsi selalu berjumlah sama dengan total nasional, dan PDB per kapita
// provinsi selaras dengan PDB nasional. Deret waktu mencakup 2015-2025.

export const COUNTRY = {
  name: 'Republik Nusara',
  shortName: 'Nusara',
  capital: 'Kota Andara',
  agency: 'Badan Statistik Nusara',
  currency: 'NRp',
  currencyName: 'Nusara rupiah',
  areaKm2: 162300,
  latestYear: 2025,
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Deret waktu nasional. values keyed by year.
export const SERIES = {
  population: {
    label: 'Jumlah Penduduk',
    unit: 'juta jiwa',
    source: 'Sensus dan Proyeksi Penduduk Nusara',
    values: { 2015: 24.9, 2016: 25.3, 2017: 25.7, 2018: 26.1, 2019: 26.5, 2020: 26.8, 2021: 27.2, 2022: 27.6, 2023: 27.9, 2024: 28.2, 2025: 28.4 },
    note: 'Penduduk hasil Sensus Penduduk 2020 dan proyeksi tahunan.',
  },
  gdp: {
    label: 'PDB Harga Berlaku',
    unit: 'triliun NRp',
    source: 'Neraca Nasional Nusara',
    values: { 2015: 1240, 2016: 1335, 2017: 1440, 2018: 1560, 2019: 1685, 2020: 1650, 2021: 1760, 2022: 1920, 2023: 2085, 2024: 2260, 2025: 2450 },
    note: 'PDB atas dasar harga berlaku, seluruh lapangan usaha.',
  },
  gdpGrowth: {
    label: 'Pertumbuhan Ekonomi',
    unit: 'persen',
    source: 'Neraca Nasional Nusara',
    values: { 2015: 5.1, 2016: 5.4, 2017: 5.6, 2018: 5.8, 2019: 5.2, 2020: -1.8, 2021: 4.6, 2022: 5.9, 2023: 5.4, 2024: 5.6, 2025: 5.3 },
    note: 'Pertumbuhan PDB harga konstan terhadap tahun sebelumnya.',
  },
  inflation: {
    label: 'Inflasi (y-on-y)',
    unit: 'persen',
    source: 'Survei Harga Konsumen Nusara',
    values: { 2015: 3.4, 2016: 3.1, 2017: 3.6, 2018: 3.2, 2019: 2.8, 2020: 2.1, 2021: 1.9, 2022: 4.2, 2023: 3.8, 2024: 2.9, 2025: 2.8 },
    note: 'Inflasi tahun kalender, Indeks Harga Konsumen 82 kota.',
  },
  unemployment: {
    label: 'Tingkat Pengangguran Terbuka',
    unit: 'persen',
    source: 'Survei Angkatan Kerja Nasional',
    values: { 2015: 5.9, 2016: 5.7, 2017: 5.5, 2018: 5.3, 2019: 5.2, 2020: 7.1, 2021: 6.4, 2022: 5.8, 2023: 5.3, 2024: 4.9, 2025: 4.6 },
    note: 'Pengangguran terbuka terhadap angkatan kerja, Agustus.',
  },
  poverty: {
    label: 'Persentase Penduduk Miskin',
    unit: 'persen',
    source: 'Survei Sosial Ekonomi Nasional',
    values: { 2015: 11.8, 2016: 11.4, 2017: 10.9, 2018: 10.4, 2019: 9.9, 2020: 10.6, 2021: 10.1, 2022: 9.6, 2023: 9.3, 2024: 9.1, 2025: 8.9 },
    note: 'Penduduk di bawah garis kemiskinan, September.',
  },
  lifeExpectancy: {
    label: 'Angka Harapan Hidup',
    unit: 'tahun',
    source: 'Sensus dan Proyeksi Penduduk Nusara',
    values: { 2015: 71.2, 2016: 71.5, 2017: 71.8, 2018: 72.1, 2019: 72.4, 2020: 72.0, 2021: 72.3, 2022: 72.8, 2023: 73.0, 2024: 73.2, 2025: 73.4 },
    note: 'Harapan hidup saat lahir, laki-laki dan perempuan.',
  },
  literacy: {
    label: 'Angka Melek Huruf',
    unit: 'persen',
    source: 'Survei Sosial Ekonomi Nasional',
    values: { 2015: 94.2, 2016: 94.6, 2017: 95.0, 2018: 95.4, 2019: 95.7, 2020: 95.9, 2021: 96.1, 2022: 96.3, 2023: 96.5, 2024: 96.7, 2025: 96.8 },
    note: 'Penduduk usia 15 tahun ke atas yang dapat membaca dan menulis.',
  },
  schoolYears: {
    label: 'Rata-rata Lama Sekolah',
    unit: 'tahun',
    source: 'Survei Sosial Ekonomi Nasional',
    values: { 2015: 8.4, 2016: 8.5, 2017: 8.7, 2018: 8.8, 2019: 9.0, 2020: 9.1, 2021: 9.2, 2022: 9.3, 2023: 9.4, 2024: 9.5, 2025: 9.6 },
    note: 'Penduduk usia 25 tahun ke atas.',
  },
  forestCover: {
    label: 'Tutupan Hutan',
    unit: 'persen dari luas daratan',
    source: 'Inventarisasi Hutan Nusara',
    values: { 2015: 58.2, 2016: 58.0, 2017: 57.7, 2018: 57.4, 2019: 57.1, 2020: 56.8, 2021: 56.6, 2022: 56.4, 2023: 56.2, 2024: 56.0, 2025: 55.9 },
    note: 'Luas hutan terhadap luas daratan Nusara.',
  },
  renewable: {
    label: 'Porsi Energi Terbarukan',
    unit: 'persen dari bauran energi',
    source: 'Neraca Energi Nusara',
    values: { 2015: 12.4, 2016: 13.1, 2017: 14.0, 2018: 15.2, 2019: 16.1, 2020: 16.8, 2021: 17.9, 2022: 19.0, 2023: 20.1, 2024: 20.9, 2025: 21.8 },
    note: 'Pembangkit listrik dari air, surya, angin, dan panas bumi.',
  },
  internet: {
    label: 'Pengguna Internet',
    unit: 'persen penduduk',
    source: 'Survei Teknologi Informasi Nusara',
    values: { 2015: 38.0, 2016: 43.0, 2017: 48.0, 2018: 53.0, 2019: 58.0, 2020: 64.0, 2021: 68.0, 2022: 71.0, 2023: 74.0, 2024: 76.0, 2025: 78.0 },
    note: 'Penduduk usia 5 tahun ke atas yang mengakses internet.',
  },
};

// Delapan provinsi. Angka tahun 2025; jumlah penduduk provinsi = 28,4 juta.
export const PROVINCES = [
  { slug: 'andara', name: 'Andara', capital: 'Kota Andara', areaKm2: 12480, population: 6.8, gdpPerCapita: 118.5, unemployment: 4.1, poverty: 6.2, literacy: 98.4, note: 'Ibu kota negara dan pusat pemerintahan.' },
  { slug: 'selat-biru', name: 'Selat Biru', capital: 'Kota Marunda', areaKm2: 21340, population: 4.2, gdpPerCapita: 92.3, unemployment: 4.8, poverty: 8.4, literacy: 97.1, note: 'Pelabuhan utama dan pusat perdagangan laut.' },
  { slug: 'gunung-raya', name: 'Gunung Raya', capital: 'Kota Waringin', areaKm2: 28960, population: 3.9, gdpPerCapita: 64.7, unemployment: 5.2, poverty: 11.3, literacy: 95.2, note: 'Kawasan pegunungan dan perkebunan dataran tinggi.' },
  { slug: 'pesisir-timur', name: 'Pesisir Timur', capital: 'Kota Tanjung Emas', areaKm2: 18750, population: 3.5, gdpPerCapita: 71.2, unemployment: 5.0, poverty: 9.8, literacy: 96.0, note: 'Pesisir perikanan dan pariwisata bahari.' },
  { slug: 'lembah-hijau', name: 'Lembah Hijau', capital: 'Kota Srimulya', areaKm2: 15620, population: 3.1, gdpPerCapita: 68.9, unemployment: 4.9, poverty: 9.1, literacy: 96.6, note: 'Lumbung pangan dan sentra pertanian.' },
  { slug: 'kepulauan-sari', name: 'Kepulauan Sari', capital: 'Kota Pulau Sari', areaKm2: 9840, population: 2.7, gdpPerCapita: 58.4, unemployment: 5.6, poverty: 12.7, literacy: 94.8, note: 'Gugusan pulau dengan ekonomi kelautan.' },
  { slug: 'dataran-emas', name: 'Dataran Emas', capital: 'Kota Tambang Jaya', areaKm2: 24110, population: 2.4, gdpPerCapita: 88.6, unemployment: 4.4, poverty: 7.6, literacy: 97.3, note: 'Kawasan pertambangan dan industri pengolahan.' },
  { slug: 'ujung-utara', name: 'Ujung Utara', capital: 'Kota Batasari', areaKm2: 31200, population: 1.8, gdpPerCapita: 52.1, unemployment: 6.3, poverty: 14.2, literacy: 93.5, note: 'Wilayah perbatasan dengan hutan terluas.' },
];

// Struktur lapangan usaha, 2025 (persen PDB).
export const GDP_SECTORS = [
  { name: 'Industri pengolahan', share: 20.4 },
  { name: 'Perdagangan', share: 13.8 },
  { name: 'Pertanian dan perikanan', share: 12.6 },
  { name: 'Konstruksi', share: 10.9 },
  { name: 'Pertambangan', share: 8.7 },
  { name: 'Transportasi dan pergudangan', share: 6.4 },
  { name: 'Informasi dan komunikasi', share: 5.8 },
  { name: 'Jasa lainnya', share: 21.4 },
];

// Komposisi penduduk menurut kelompok umur, 2025 (persen).
export const AGE_GROUPS = [
  { name: '0-14 tahun', share: 24.6 },
  { name: '15-24 tahun', share: 17.3 },
  { name: '25-54 tahun', share: 41.2 },
  { name: '55-64 tahun', share: 9.8 },
  { name: '65 tahun ke atas', share: 7.1 },
];

// Kelompok pengeluaran untuk inflasi, 2025 (persen y-on-y per kelompok).
export const CPI_GROUPS = [
  { name: 'Makanan dan minuman', rate: 3.9 },
  { name: 'Perumahan dan air', rate: 2.1 },
  { name: 'Transportasi', rate: 2.4 },
  { name: 'Pakaian dan alas kaki', rate: 1.8 },
  { name: 'Kesehatan', rate: 2.6 },
  { name: 'Pendidikan', rate: 2.2 },
  { name: 'Rekreasi dan budaya', rate: 1.5 },
];

// Status pekerjaan utama, Agustus 2025 (persen pekerja).
export const EMPLOYMENT_STATUS = [
  { name: 'Buruh dan karyawan', share: 42.8 },
  { name: 'Berusaha sendiri', share: 21.5 },
  { name: 'Pekerja keluarga', share: 13.2 },
  { name: 'Pekerja bebas', share: 12.4 },
  { name: 'Berusaha dibantu buruh', share: 10.1 },
];

// Rilis berita data terbaru.
export const NEWS = [
  { date: '5 Feb 2026', title: 'Ekonomi Nusara 2025 tumbuh 5,3 persen', text: 'PDB 2025 mencapai 2.450 triliun NRp. Pertumbuhan didorong konsumsi rumah tangga dan investasi bangunan.' },
  { date: '2 Feb 2026', title: 'Inflasi Januari 2026 sebesar 0,32 persen', text: 'Inflasi tahunan Januari 2026 tercatat 2,6 persen, tetap dalam sasaran 2,5 persen plus minus 1 persen.' },
  { date: '15 Jan 2026', title: 'Penduduk Nusara 2025 mencapai 28,4 juta jiwa', text: 'Laju pertumbuhan penduduk 0,7 persen. Andara tetap provinsi terpadat dengan 6,8 juta jiwa.' },
  { date: '10 Des 2025', title: 'Kemiskinan September 2025 turun menjadi 8,9 persen', text: 'Jumlah penduduk miskin 2,53 juta jiwa, turun 0,2 poin dari Maret 2025.' },
  { date: '5 Nov 2025', title: 'Pengangguran Agustus 2025 turun ke 4,6 persen', text: 'Tingkat pengangguran terbuka terendah sejak 2015. Sektor jasa menyerap tambahan 214 ribu pekerja.' },
];

// Daftar indikator untuk penjelajah data (#/data).
export const INDICATOR_TABLE = [
  { id: 'population', name: 'Jumlah Penduduk', category: 'Kependudukan', unit: 'juta jiwa' },
  { id: 'gdp', name: 'PDB Harga Berlaku', category: 'Ekonomi', unit: 'triliun NRp' },
  { id: 'gdpGrowth', name: 'Pertumbuhan Ekonomi', category: 'Ekonomi', unit: '%' },
  { id: 'inflation', name: 'Inflasi (y-on-y)', category: 'Harga', unit: '%' },
  { id: 'unemployment', name: 'Tingkat Pengangguran Terbuka', category: 'Ketenagakerjaan', unit: '%' },
  { id: 'poverty', name: 'Persentase Penduduk Miskin', category: 'Kesejahteraan', unit: '%' },
  { id: 'lifeExpectancy', name: 'Angka Harapan Hidup', category: 'Kesehatan', unit: 'tahun' },
  { id: 'literacy', name: 'Angka Melek Huruf', category: 'Pendidikan', unit: '%' },
  { id: 'schoolYears', name: 'Rata-rata Lama Sekolah', category: 'Pendidikan', unit: 'tahun' },
  { id: 'forestCover', name: 'Tutupan Hutan', category: 'Lingkungan', unit: '%' },
  { id: 'renewable', name: 'Porsi Energi Terbarukan', category: 'Lingkungan', unit: '%' },
  { id: 'internet', name: 'Pengguna Internet', category: 'Teknologi', unit: '%' },
];

export function valueAt(seriesId, year) {
  return SERIES[seriesId].values[year];
}

export function changeSince(seriesId, fromYear, toYear) {
  return SERIES[seriesId].values[toYear] - SERIES[seriesId].values[fromYear];
}

export function formatNumber(n, decimals = 1) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
