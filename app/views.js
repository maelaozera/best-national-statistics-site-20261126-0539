// Template HTML tiap halaman. Semua angka diambil dari data.js dan ditulis
// ke halaman lewat fungsi-fungsi di sini; main.js yang memanggilnya.

import {
  COUNTRY, YEARS, SERIES, PROVINCES, GDP_SECTORS, AGE_GROUPS, CPI_GROUPS,
  EMPLOYMENT_STATUS, NEWS, INDICATOR_TABLE, valueAt, formatNumber,
} from './data.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

export function yearPicker(selected, label = 'Tahun data') {
  return `<label class="picker">${escape(label)}
  <select id="year-select" data-action="year">${yearOptions(selected)}</select></label>`;
}

function kpi(label, value, unit, delta, source) {
  return `<div class="kpi">
  <span class="kpi-label">${escape(label)}</span>
  <span class="kpi-value">${escape(value)} <small>${escape(unit)}</small></span>
  <span class="kpi-delta">${escape(delta)}</span>
  <span class="kpi-source">${escape(source)}</span>
</div>`;
}

function pageHead(title, intro) {
  return `<h1>${escape(title)}</h1><p class="lede">${escape(intro)}</p>`;
}

function chartCard(id, title, subtitle, tabs) {
  const tabHtml = tabs
    ? `<div class="tabs" role="group" aria-label="Jenis grafik">${tabs.map((t) => `<button type="button" data-chart-tab="${t.id}">${escape(t.label)}</button>`).join('')}</div>`
    : '';
  return `<section class="card chart-card">
  <div class="card-head"><div><h2>${escape(title)}</h2><p>${escape(subtitle)}</p></div>${tabHtml}</div>
  <canvas id="${id}" height="260" aria-label="Grafik ${escape(title)}"></canvas>
</section>`;
}

function sourceNote(seriesId, year) {
  const s = SERIES[seriesId];
  return `<p class="source">Sumber: ${escape(s.source)}, ${year}. ${escape(s.note)}</p>`;
}

// ---------- Beranda ----------

export function home(year) {
  const pop = valueAt('population', year);
  const gdp = valueAt('gdp', year);
  const growth = valueAt('gdpGrowth', year);
  const infl = valueAt('inflation', year);
  const unemp = valueAt('unemployment', year);
  const poverty = valueAt('poverty', year);
  const news = NEWS.map((n) => `<article class="news-item">
    <time>${escape(n.date)}</time>
    <h3>${escape(n.title)}</h3>
    <p>${escape(n.text)}</p>
  </article>`).join('');
  const highlights = [
    { label: 'Penduduk', value: formatNumber(pop), unit: 'juta jiwa', to: '#/penduduk' },
    { label: 'PDB', value: formatNumber(gdp, 0), unit: 'triliun NRp', to: '#/ekonomi' },
    { label: 'Pertumbuhan ekonomi', value: formatNumber(growth), unit: '%', to: '#/ekonomi' },
    { label: 'Inflasi', value: formatNumber(infl), unit: '%', to: '#/harga' },
    { label: 'Pengangguran', value: formatNumber(unemp), unit: '%', to: '#/tenaga-kerja' },
    { label: 'Penduduk miskin', value: formatNumber(poverty), unit: '%', to: '#/tentang' },
  ].map((h) => `<a class="highlight" href="${h.to}">
    <span class="highlight-label">${escape(h.label)}</span>
    <span class="highlight-value">${escape(h.value)} <small>${escape(h.unit)}</small></span>
    <span class="highlight-link">Lihat indikator &rarr;</span>
  </a>`).join('');
  return `<section class="hero">
  <div>
    <p class="eyebrow">${escape(COUNTRY.agency)} &middot; ${escape(COUNTRY.name)}</p>
    <h1>Statistik Nusara, terbuka untuk semua</h1>
    <p class="lede">Data resmi penduduk, ekonomi, harga, tenaga kerja, kesehatan, pendidikan, dan lingkungan Republik Nusara &mdash; diperbarui dari sensus dan survei nasional, bisa dijelajahi sampai tingkat provinsi.</p>
    <p class="hero-actions"><a class="btn" href="#/data">Jelajahi Data</a> <a class="btn btn-ghost" href="#/wilayah">Statistik Provinsi</a></p>
  </div>
  <div class="hero-facts">
    <div><strong>${formatNumber(pop)}</strong><span>juta penduduk (${year})</span></div>
    <div><strong>${formatNumber(gdp, 0)}</strong><span>triliun NRp PDB (${year})</span></div>
    <div><strong>8</strong><span>provinsi</span></div>
    <div><strong>2015&ndash;2025</strong><span>deret waktu tersedia</span></div>
  </div>
</section>
<section class="toolbar"><h2>Indikator utama ${year}</h2>${yearPicker(year)}</section>
<section class="highlights">${highlights}</section>
<div class="grid-2">
  ${chartCard('chart-pop', 'Pertumbuhan Penduduk', 'Jumlah penduduk Nusara, 2015–2025', null)}
  ${chartCard('chart-gdp', 'PDB Harga Berlaku 2015–2025', 'Triliun NRp, Neraca Nasional Nusara', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Rilis data terbaru</h2><p>Berita resmi dari Badan Statistik Nusara</p></div></div>
  <div class="news">${news}</div>
</section>
<p class="source">Sumber: Sensus dan Proyeksi Penduduk Nusara; Neraca Nasional Nusara; Survei Harga Konsumen Nusara. Tahun rujukan ${year}.</p>`;
}

// ---------- Penduduk ----------

export function penduduk(year) {
  const pop = valueAt('population', year);
  const prev = valueAt('population', year - 1);
  const growth = prev ? ((pop - prev) / prev) * 100 : 0;
  const density = (pop * 1000000) / COUNTRY.areaKm2;
  const rows = PROVINCES.map((p) => `<tr>
    <td><a href="#/wilayah?provinsi=${p.slug}">${escape(p.name)}</a></td>
    <td class="num">${formatNumber(p.population)}</td>
    <td class="num">${formatNumber((p.population / 28.4) * 100)}</td>
    <td class="num">${formatNumber((p.population * 1000000) / p.areaKm2, 0)}</td>
  </tr>`).join('');
  return `${pageHead('Penduduk', 'Jumlah, sebaran, dan struktur umur penduduk Republik Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Jumlah penduduk', formatNumber(pop), 'juta jiwa', `Tumbuh ${formatNumber(growth)}% dari ${year - 1}`, 'Proyeksi Penduduk')}
  ${kpi('Kepadatan penduduk', formatNumber(density, 0), 'jiwa/km&sup2;', `Luas daratan ${formatNumber(COUNTRY.areaKm2, 0)} km&sup2;`, 'Proyeksi Penduduk')}
  ${kpi('Angka harapan hidup', formatNumber(valueAt('lifeExpectancy', year)), 'tahun', `Naik ${formatNumber(valueAt('lifeExpectancy', year) - valueAt('lifeExpectancy', 2015))} tahun sejak 2015`, 'Sensus dan Proyeksi')}
  ${kpi('Pengguna internet', formatNumber(valueAt('internet', year), 0), '% penduduk', `Naik dari 38% pada 2015`, 'Survei Teknologi Informasi')}
</section>
<div class="grid-2">
  ${chartCard('chart-pop-line', 'Jumlah Penduduk 2015–2025', 'Juta jiwa, hasil sensus dan proyeksi tahunan', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-age', 'Struktur Umur Penduduk 2025', 'Persen penduduk menurut kelompok umur', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Penduduk menurut provinsi, 2025</h2><p>Klik nama provinsi untuk melihat profil lengkapnya</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Provinsi</th><th class="num">Penduduk (juta)</th><th class="num">Pangsa (%)</th><th class="num">Kepadatan (jiwa/km&sup2;)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</section>
${sourceNote('population', year)}`;
}

// ---------- Ekonomi ----------

export function ekonomi(year) {
  const gdp = valueAt('gdp', year);
  const growth = valueAt('gdpGrowth', year);
  const gdpPc = (gdp * 1e12) / (valueAt('population', year) * 1e6) / 1e6;
  const sectorRows = GDP_SECTORS.map((s) => `<tr><td>${escape(s.name)}</td><td class="num">${formatNumber(s.share)}</td></tr>`).join('');
  return `${pageHead('Ekonomi', 'Produk domestik bruto, pertumbuhan, dan struktur lapangan usaha Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('PDB harga berlaku', formatNumber(gdp, 0), 'triliun NRp', `Tumbuh ${formatNumber(growth)}% dari ${year - 1}`, 'Neraca Nasional')}
  ${kpi('PDB per kapita', formatNumber(gdpPc), 'juta NRp', `Sekitar ${formatNumber(gdpPc * 1000000, 0)} NRp per orang`, 'Neraca Nasional')}
  ${kpi('Pertumbuhan ekonomi', formatNumber(growth), '%', year === 2020 ? 'Kontraksi tahun pandemi' : `Di atas rata-rata 2015–2019 sebesar 5,4%`, 'Neraca Nasional')}
  ${kpi('Inflasi', formatNumber(valueAt('inflation', year)), '%', 'Dalam sasaran 2,5% ± 1 poin', 'Survei Harga Konsumen')}
</section>
<div class="grid-2">
  ${chartCard('chart-gdp-line', 'PDB Harga Berlaku 2015–2025', 'Triliun NRp', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-sectors', 'Struktur PDB menurut Lapangan Usaha, 2025', 'Persen terhadap total PDB', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>PDB menurut lapangan usaha, 2025</h2><p>Pangsa terhadap total PDB</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Lapangan usaha</th><th class="num">Pangsa (%)</th></tr></thead>
    <tbody>${sectorRows}</tbody>
  </table></div>
</section>
${sourceNote('gdp', year)}`;
}

// ---------- Tenaga kerja ----------

export function tenagaKerja(year) {
  const unemp = valueAt('unemployment', year);
  const statusRows = EMPLOYMENT_STATUS.map((s) => `<tr><td>${escape(s.name)}</td><td class="num">${formatNumber(s.share)}</td></tr>`).join('');
  return `${pageHead('Tenaga Kerja', 'Angkatan kerja, pengangguran, dan status pekerjaan utama di Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Tingkat pengangguran terbuka', formatNumber(unemp), '%', `Turun ${formatNumber(valueAt('unemployment', 2015) - unemp)} poin sejak 2015`, 'Survei Angkatan Kerja')}
  ${kpi('Angkatan kerja', formatNumber(valueAt('population', year) * 0.52), 'juta orang', 'Sekitar 52% dari penduduk', 'Survei Angkatan Kerja')}
  ${kpi('Pekerja formal', formatNumber(42.8), '% pekerja', 'Buruh dan karyawan', 'Survei Angkatan Kerja')}
  ${kpi('Penduduk miskin', formatNumber(valueAt('poverty', year)), '%', `Turun ${formatNumber(valueAt('poverty', 2015) - valueAt('poverty', year))} poin sejak 2015`, 'Survei Sosial Ekonomi')}
</section>
<div class="grid-2">
  ${chartCard('chart-unemp', 'Tingkat Pengangguran Terbuka 2015–2025', 'Persen angkatan kerja, Agustus', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-status', 'Status Pekerjaan Utama, Agustus 2025', 'Persen pekerja', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Status pekerjaan utama, Agustus 2025</h2><p>Persen dari seluruh pekerja</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Status pekerjaan</th><th class="num">Pangsa (%)</th></tr></thead>
    <tbody>${statusRows}</tbody>
  </table></div>
  <p class="card-note">Pekerja formal (buruh dan karyawan) mencapai 42,8 persen; sisanya bekerja informal, terbanyak sebagai berusaha sendiri dan pekerja keluarga.</p>
</section>
${sourceNote('unemployment', year)}`;
}

// ---------- Harga ----------

export function harga(year) {
  const infl = valueAt('inflation', year);
  const rows = CPI_GROUPS.map((g) => `<tr><td>${escape(g.name)}</td><td class="num">${formatNumber(g.rate)}</td></tr>`).join('');
  return `${pageHead('Harga dan Inflasi', 'Perkembangan Indeks Harga Konsumen dan inflasi menurut kelompok pengeluaran.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Inflasi tahun kalender', formatNumber(infl), '%', 'Sasaran 2,5% ± 1 poin', 'Survei Harga Konsumen')}
  ${kpi('Inflasi Januari 2026', formatNumber(0.32), '% bulanan', 'Inflasi tahunan 2,6%', 'Survei Harga Konsumen')}
  ${kpi('Inflasi makanan', formatNumber(3.9), '%', 'Kelompok dengan inflasi tertinggi 2025', 'Survei Harga Konsumen')}
  ${kpi('Inflasi tertinggi', formatNumber(4.2), '% pada 2022', 'Puncak dalam sepuluh tahun terakhir', 'Survei Harga Konsumen')}
</section>
<div class="grid-2">
  ${chartCard('chart-infl', 'Inflasi Tahunan 2015–2025', 'Persen year-on-year, Indeks Harga Konsumen', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-cpi', 'Inflasi menurut Kelompok Pengeluaran, 2025', 'Persen year-on-year per kelompok', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Inflasi menurut kelompok pengeluaran, 2025</h2><p>Persen year-on-year, Desember 2025</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Kelompok pengeluaran</th><th class="num">Inflasi (%)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="card-note">Makanan dan minuman memberi andil terbesar pada inflasi 2025, diikuti kesehatan dan transportasi.</p>
</section>
${sourceNote('inflation', year)}`;
}

// ---------- Kesehatan ----------

export function kesehatan(year) {
  return `${pageHead('Kesehatan', 'Harapan hidup, fasilitas kesehatan, dan capaian layanan kesehatan Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Angka harapan hidup', formatNumber(valueAt('lifeExpectancy', year)), 'tahun', `Naik ${formatNumber(valueAt('lifeExpectancy', year) - valueAt('lifeExpectancy', 2015))} tahun sejak 2015`, 'Sensus dan Proyeksi')}
  ${kpi('Rumah sakit', formatNumber(412, 0), 'unit', '2.140 puskesmas di seluruh provinsi', 'Profil Kesehatan')}
  ${kpi('Tenaga kesehatan', formatNumber(18.6), 'per 10.000 penduduk', 'Dokter, perawat, dan bidan', 'Profil Kesehatan')}
  ${kpi('Imunisasi lengkap', formatNumber(93.4), '% balita', 'Imunisasi dasar lengkap usia 12–23 bulan', 'Survei Kesehatan')}
</section>
<div class="grid-2">
  ${chartCard('chart-life', 'Angka Harapan Hidup 2015–2025', 'Tahun, saat lahir', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  <section class="card"><div class="card-head"><div><h2>Layanan kesehatan, ${year}</h2><p>Capaian utama program kesehatan</p></div></div>
  <ul class="fact-list">
    <li><strong>412</strong> rumah sakit umum dan khusus beroperasi di 8 provinsi.</li>
    <li><strong>2.140</strong> puskesmas melayani kecamatan, 96 persen di antaranya buka enam hari seminggu.</li>
    <li><strong>93,4%</strong> balita menerima imunisasi dasar lengkap.</li>
    <li><strong>78,2%</strong> persalinan ditolong tenaga kesehatan di fasilitas kesehatan.</li>
    <li><strong>6,1%</strong> penduduk melaporkan keluhan kesehatan dalam sebulan terakhir, turun dari 8,4 persen pada 2015.</li>
  </ul></section>
</div>
${sourceNote('lifeExpectancy', year)}`;
}

// ---------- Pendidikan ----------

export function pendidikan(year) {
  return `${pageHead('Pendidikan', 'Melek huruf, lama sekolah, dan partisipasi pendidikan di Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Angka melek huruf', formatNumber(valueAt('literacy', year)), '%', `Naik ${formatNumber(valueAt('literacy', year) - valueAt('literacy', 2015))} poin sejak 2015`, 'Survei Sosial Ekonomi')}
  ${kpi('Rata-rata lama sekolah', formatNumber(valueAt('schoolYears', year)), 'tahun', 'Penduduk usia 25 tahun ke atas', 'Survei Sosial Ekonomi')}
  ${kpi('Partisipasi SMA', formatNumber(84.7), '%', 'Angka partisipasi murni jenjang SMA', 'Survei Sosial Ekonomi')}
  ${kpi('Partisipasi perguruan tinggi', formatNumber(38.2), '%', 'Angka partisipasi kasar jenjang tinggi', 'Survei Sosial Ekonomi')}
</section>
<div class="grid-2">
  ${chartCard('chart-literacy', 'Angka Melek Huruf 2015–2025', 'Persen penduduk usia 15 tahun ke atas', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-school', 'Rata-rata Lama Sekolah 2015–2025', 'Tahun, penduduk usia 25 tahun ke atas', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Partisipasi pendidikan, ${year}</h2><p>Angka partisipasi menurut jenjang</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Jenjang</th><th class="num">Partisipasi (%)</th><th>Keterangan</th></tr></thead>
    <tbody>
      <tr><td>Sekolah dasar</td><td class="num">99,1</td><td>Angka partisipasi murni</td></tr>
      <tr><td>Sekolah menengah pertama</td><td class="num">94,6</td><td>Angka partisipasi murni</td></tr>
      <tr><td>Sekolah menengah atas</td><td class="num">84,7</td><td>Angka partisipasi murni</td></tr>
      <tr><td>Perguruan tinggi</td><td class="num">38,2</td><td>Angka partisipasi kasar</td></tr>
    </tbody>
  </table></div>
</section>
${sourceNote('literacy', year)}`;
}

// ---------- Lingkungan ----------

export function lingkungan(year) {
  return `${pageHead('Lingkungan', 'Hutan, energi terbarukan, dan kualitas lingkungan hidup Nusara.')}
<section class="toolbar">${yearPicker(year)}</section>
<section class="kpis">
  ${kpi('Tutupan hutan', formatNumber(valueAt('forestCover', year)), '% daratan', `Turun ${formatNumber(valueAt('forestCover', 2015) - valueAt('forestCover', year))} poin sejak 2015`, 'Inventarisasi Hutan')}
  ${kpi('Energi terbarukan', formatNumber(valueAt('renewable', year)), '% bauran energi', `Naik ${formatNumber(valueAt('renewable', year) - valueAt('renewable', 2015))} poin sejak 2015`, 'Neraca Energi')}
  ${kpi('Emisi per kapita', formatNumber(2.4), 'ton CO&sub2;e', 'Turun dari 2,9 ton pada 2015', 'Inventarisasi Emisi')}
  ${kpi('Kawasan lindung', formatNumber(18.6), '% daratan', 'Taman nasional dan cagar alam', 'Inventarisasi Hutan')}
</section>
<div class="grid-2">
  ${chartCard('chart-forest', 'Tutupan Hutan 2015–2025', 'Persen dari luas daratan', [{ id: 'line', label: 'Garis' }, { id: 'bar', label: 'Batang' }])}
  ${chartCard('chart-renew', 'Porsi Energi Terbarukan 2015–2025', 'Persen dari bauran energi listrik', null)}
</div>
<section class="card">
  <div class="card-head"><div><h2>Catatan lingkungan, ${year}</h2><p>Apa yang berubah dalam sepuluh tahun terakhir</p></div></div>
  <ul class="fact-list">
    <li><strong>Deforestasi melambat:</strong> kehilangan hutan tahunan turun dari 0,3 persen pada 2015 menjadi 0,1 persen pada 2025.</li>
    <li><strong>Energi surya tumbuh tercepat:</strong> kapasitas terpasang surya naik dari 40 MW pada 2015 menjadi 1.240 MW pada 2025.</li>
    <li><strong>Air bersih:</strong> 91,2 persen rumah tangga memakai air minum dari sumber terlindungi.</li>
    <li><strong>Sampah terkelola:</strong> 68,4 persen sampah perkotaan diolah di tempat pemrosesan akhir.</li>
  </ul>
</section>
${sourceNote('forestCover', year)}`;
}

// ---------- Wilayah ----------

export function wilayah(selectedSlug) {
  const selected = PROVINCES.find((p) => p.slug === selectedSlug) || PROVINCES[0];
  const options = PROVINCES.map((p) => `<option value="${p.slug}"${p.slug === selected.slug ? ' selected' : ''}>${escape(p.name)}</option>`).join('');
  const density = (selected.population * 1000000) / selected.areaKm2;
  const rows = PROVINCES.map((p) => `<tr${p.slug === selected.slug ? ' class="row-active"' : ''}>
    <td><a href="#/wilayah?provinsi=${p.slug}">${escape(p.name)}</a></td>
    <td>${escape(p.capital)}</td>
    <td class="num">${formatNumber(p.population)}</td>
    <td class="num">${formatNumber(p.gdpPerCapita)}</td>
    <td class="num">${formatNumber(p.unemployment)}</td>
    <td class="num">${formatNumber(p.poverty)}</td>
    <td class="num">${formatNumber(p.literacy)}</td>
  </tr>`).join('');
  return `${pageHead('Statistik Wilayah', 'Perbandingan delapan provinsi Republik Nusara dan profil tiap provinsi.')}
<section class="toolbar"><label class="picker">Pilih provinsi
  <select id="province-select" data-action="province">${options}</select></label></section>
<section class="card province-hero">
  <div class="card-head"><div><h2>Provinsi ${escape(selected.name)}</h2><p>Ibu kota: ${escape(selected.capital)} &middot; ${escape(selected.note)}</p></div></div>
  <div class="kpis">
    ${kpi('Penduduk', formatNumber(selected.population), 'juta jiwa', `Pangsa ${formatNumber((selected.population / 28.4) * 100)}% dari nasional`, 'Proyeksi Penduduk 2025')}
    ${kpi('Luas wilayah', formatNumber(selected.areaKm2, 0), 'km&sup2;', `Kepadatan ${formatNumber(density, 0)} jiwa/km&sup2;`, 'Pemetaan Wilayah')}
    ${kpi('PDB per kapita', formatNumber(selected.gdpPerCapita), 'juta NRp', 'Nasional: 86,3 juta NRp', 'Neraca Nasional 2025')}
    ${kpi('Pengangguran', formatNumber(selected.unemployment), '%', 'Nasional: 4,6%', 'Survei Angkatan Kerja')}
    ${kpi('Penduduk miskin', formatNumber(selected.poverty), '%', 'Nasional: 8,9%', 'Survei Sosial Ekonomi')}
    ${kpi('Melek huruf', formatNumber(selected.literacy), '%', 'Nasional: 96,8%', 'Survei Sosial Ekonomi')}
  </div>
</section>
<section class="card">
  <div class="card-head"><div><h2>Semua provinsi, 2025</h2><p>Klik nama provinsi untuk melihat profilnya</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Provinsi</th><th>Ibu kota</th><th class="num">Penduduk (juta)</th><th class="num">PDB/kapita (juta NRp)</th><th class="num">Pengangguran (%)</th><th class="num">Miskin (%)</th><th class="num">Melek huruf (%)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="card-note">Andara mencatat PDB per kapita tertinggi (118,5 juta NRp) dan Ujung Utara terendah (52,1 juta NRp). Selisih antarprovinsi menyempit sejak 2015.</p>
</section>
<p class="source">Sumber: Proyeksi Penduduk 2025; Neraca Nasional 2025; Survei Angkatan Kerja Nasional Agustus 2025; Survei Sosial Ekonomi Nasional September 2025.</p>`;
}

// ---------- Penjelajah data ----------

export function dataExplorer(state) {
  const { year, query, sortKey, sortDir } = state;
  const columns = [
    { key: 'name', label: 'Indikator' },
    { key: 'category', label: 'Kategori' },
    { key: 'unit', label: 'Satuan' },
    { key: 'value', label: `Nilai ${year}` },
    { key: 'change', label: 'Perubahan 2015–2025' },
  ];
  let rows = INDICATOR_TABLE.map((ind) => {
    const s = SERIES[ind.id];
    return {
      id: ind.id,
      name: ind.name,
      category: ind.category,
      unit: ind.unit,
      value: s.values[year],
      change: s.values[2025] - s.values[2015],
      source: s.source,
    };
  });
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter((r) => `${r.name} ${r.category} ${r.unit}`.toLowerCase().includes(q));
  }
  rows.sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id');
    return sortDir === 'desc' ? -cmp : cmp;
  });
  const body = rows.length
    ? rows.map((r) => `<tr>
      <td><a href="#/${r.id === 'population' ? 'penduduk' : r.id === 'gdp' || r.id === 'gdpGrowth' ? 'ekonomi' : r.id === 'inflation' ? 'harga' : r.id === 'unemployment' ? 'tenaga-kerja' : r.id === 'poverty' ? 'tenaga-kerja' : r.id === 'lifeExpectancy' ? 'kesehatan' : r.id === 'literacy' || r.id === 'schoolYears' ? 'pendidikan' : 'lingkungan'}">${escape(r.name)}</a></td>
      <td>${escape(r.category)}</td>
      <td>${escape(r.unit)}</td>
      <td class="num">${formatNumber(r.value, r.id === 'gdp' ? 0 : 1)}</td>
      <td class="num">${r.change >= 0 ? '+' : ''}${formatNumber(r.change)}</td>
    </tr>`).join('')
    : `<tr><td colspan="5">Tidak ada indikator yang cocok dengan &ldquo;${escape(query)}&rdquo;. Coba kata kunci lain.</td></tr>`;
  const head = columns.map((c) => `<th data-sort="${c.key}" class="${sortKey === c.key ? `sorted ${sortDir}` : ''}">${escape(c.label)}${sortKey === c.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>`).join('');
  return `${pageHead('Penjelajah Data', 'Semua indikator utama dalam satu tabel. Klik judul kolom untuk mengurutkan, ketik untuk mencari, dan pilih tahun untuk melihat nilainya.')}
<section class="toolbar">
  ${yearPicker(year)}
  <label class="picker">Cari indikator
    <input id="data-search" type="search" placeholder="mis. inflasi, penduduk, hutan&hellip;" value="${escape(query)}" data-action="search"></label>
</section>
<section class="card">
  <div class="card-head"><div><h2>Indikator nasional, ${year}</h2><p>${rows.length} dari ${INDICATOR_TABLE.length} indikator &middot; klik judul kolom untuk mengurutkan</p></div></div>
  <div class="table-wrap"><table class="data-table sortable">
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table></div>
  <p class="card-note">Nilai perubahan memakai tahun 2015 sebagai pembanding. Unduh data lengkap tersedia di kantor Badan Statistik Nusara, Kota Andara.</p>
</section>
<p class="source">Sumber: publikasi resmi Badan Statistik Nusara, 2015–2025. Setiap indikator merujuk ke halaman tematiknya lewat nama indikator.</p>`;
}

// ---------- Tentang ----------

export function tentang() {
  return `${pageHead('Tentang Portal Ini', 'Bagaimana data Nusara dikumpulkan, diolah, dan disajikan.')}
<section class="card">
  <div class="card-head"><div><h2>Metodologi</h2><p>Dari lapangan sampai ke layar Anda</p></div></div>
  <ul class="fact-list">
    <li><strong>Sensus Penduduk</strong> dilaksanakan sepuluh tahun sekali; tahun di antaranya memakai proyeksi berbasis kelahiran, kematian, dan migrasi.</li>
    <li><strong>Survei Angkatan Kerja Nasional</strong> mewawancarai 120.000 rumah tangga setiap Februari dan Agustus.</li>
    <li><strong>Survei Harga Konsumen</strong> memantau 320 barang dan jasa di 82 kota setiap bulan.</li>
    <li><strong>Survei Sosial Ekonomi Nasional</strong> mengukur kemiskinan, pendidikan, dan kesehatan dari 300.000 rumah tangga setiap Maret dan September.</li>
    <li><strong>Neraca Nasional</strong> menyusun PDB dari laporan perusahaan, anggaran pemerintah, dan survei lapangan.</li>
  </ul>
</section>
<section class="card">
  <div class="card-head"><div><h2>Sumber data</h2><p>Publikasi yang dipakai portal ini</p></div></div>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Publikasi</th><th>Terbit</th><th>Isi</th></tr></thead>
    <tbody>
      <tr><td>Statistik Nusara 2025</td><td>Feb 2026</td><td>Seluruh indikator utama</td></tr>
      <tr><td>Pertumbuhan Ekonomi Nusara 2025</td><td>Feb 2026</td><td>PDB dan pertumbuhan</td></tr>
      <tr><td>Keadaan Angkatan Kerja Agustus 2025</td><td>Nov 2025</td><td>Pengangguran dan pekerjaan</td></tr>
      <tr><td>Profil Kemiskinan September 2025</td><td>Des 2025</td><td>Kemiskinan provinsi dan nasional</td></tr>
      <tr><td>Statistik Lingkungan Hidup 2025</td><td>Jan 2026</td><td>Hutan, energi, dan emisi</td></tr>
    </tbody>
  </table></div>
</section>
<section class="card">
  <div class="card-head"><div><h2>Catatan penting</h2><p>Yang perlu Anda ketahui</p></div></div>
  <ul class="fact-list">
    <li>Republik Nusara adalah negara fiktif. Angka-angka di portal ini bersifat ilustratif dan disusun agar konsisten antar halaman, bukan data resmi negara mana pun.</li>
    <li>Portal ini berjalan sepenuhnya dari berkasnya sendiri tanpa permintaan jaringan, sehingga bisa dibuka luring.</li>
    <li>Pertanyaan tentang data: kunjungi kantor Badan Statistik Nusara, Jalan Merdeka 1, Kota Andara, atau kirim surat ke data@nusara.example.</li>
  </ul>
</section>`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1>
<p class="lede">Alamat yang Anda buka tidak ada di portal ini.</p>
<p><a class="btn" href="#/">Kembali ke Beranda</a></p>`;
}
