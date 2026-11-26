// Router dan pengikat kontrol Portal Statistik Nusara.
//
//   #/                 Beranda
//   #/penduduk         Kependudukan
//   #/ekonomi          Ekonomi
//   #/tenaga-kerja     Tenaga kerja
//   #/harga            Harga dan inflasi
//   #/kesehatan        Kesehatan
//   #/pendidikan       Pendidikan
//   #/lingkungan       Lingkungan
//   #/wilayah          Statistik provinsi (tambah ?provinsi=<slug>)
//   #/data             Penjelajah data
//   #/tentang          Metodologi dan sumber
//
// window.__shotReady bernilai false selama halaman dirender dan true setelah
// halaman selesai, agar skrip screenshot tahu kapan menangkap layar.

import { YEARS, SERIES, PROVINCES, GDP_SECTORS, AGE_GROUPS, CPI_GROUPS, EMPLOYMENT_STATUS, formatNumber } from './data.js';
import { drawLine, drawBar, drawDonut } from './charts.js';
import * as views from './views.js';

const app = document.getElementById('app');
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

const state = {
  year: 2025,
  province: 'andara',
  chartMode: {}, // chart id -> 'line' | 'bar'
  sortKey: 'name',
  sortDir: 'asc',
  query: '',
};

const yearLabels = YEARS.map(String);
const fmt1 = (v) => formatNumber(v, 1);
const fmt0 = (v) => formatNumber(v, 0);

function seriesValues(id) {
  return YEARS.map((y) => SERIES[id].values[y]);
}

function drawIfPresent(id, draw) {
  const canvas = document.getElementById(id);
  if (canvas) draw(canvas);
}

function lineOrBar(canvas, labels, values, format) {
  const mode = state.chartMode[canvas.id] || 'line';
  if (mode === 'bar') drawBar(canvas, labels, values, { format });
  else drawLine(canvas, labels, values, { format });
}

function drawCharts(route) {
  if (route === '') {
    drawIfPresent('chart-pop', (c) => drawLine(c, yearLabels, seriesValues('population'), { format: fmt1 }));
    drawIfPresent('chart-gdp', (c) => drawLine(c, yearLabels, seriesValues('gdp'), { format: fmt0 }));
  }
  if (route === 'penduduk') {
    drawIfPresent('chart-pop-line', (c) => lineOrBar(c, yearLabels, seriesValues('population'), fmt1));
    drawIfPresent('chart-age', (c) => drawDonut(c, AGE_GROUPS, { center: '28,4 jt', centerSub: 'penduduk 2025' }));
  }
  if (route === 'ekonomi') {
    drawIfPresent('chart-gdp-line', (c) => lineOrBar(c, yearLabels, seriesValues('gdp'), fmt0));
    drawIfPresent('chart-sectors', (c) => drawDonut(c, GDP_SECTORS, { center: '2.450', centerSub: 'triliun NRp' }));
  }
  if (route === 'tenaga-kerja') {
    drawIfPresent('chart-unemp', (c) => lineOrBar(c, yearLabels, seriesValues('unemployment'), fmt1));
    drawIfPresent('chart-status', (c) => drawDonut(c, EMPLOYMENT_STATUS, { center: '14,8 jt', centerSub: 'pekerja 2025' }));
  }
  if (route === 'harga') {
    drawIfPresent('chart-infl', (c) => lineOrBar(c, yearLabels, seriesValues('inflation'), fmt1));
    drawIfPresent('chart-cpi', (c) => drawBar(c, CPI_GROUPS.map((g) => g.name.split(' ')[0]), CPI_GROUPS.map((g) => g.rate), { format: fmt1 }));
  }
  if (route === 'kesehatan') {
    drawIfPresent('chart-life', (c) => lineOrBar(c, yearLabels, seriesValues('lifeExpectancy'), fmt1));
  }
  if (route === 'pendidikan') {
    drawIfPresent('chart-literacy', (c) => lineOrBar(c, yearLabels, seriesValues('literacy'), fmt1));
    drawIfPresent('chart-school', (c) => drawLine(c, yearLabels, seriesValues('schoolYears'), { format: fmt1 }));
  }
  if (route === 'lingkungan') {
    drawIfPresent('chart-forest', (c) => lineOrBar(c, yearLabels, seriesValues('forestCover'), fmt1));
    drawIfPresent('chart-renew', (c) => drawLine(c, yearLabels, seriesValues('renewable'), { format: fmt1 }));
  }
}

function bindControls(route) {
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      state.year = Number(yearSelect.value);
      render();
    });
  }
  const provinceSelect = document.getElementById('province-select');
  if (provinceSelect) {
    provinceSelect.addEventListener('change', () => {
      state.province = provinceSelect.value;
      history.replaceState(null, '', `#/wilayah?provinsi=${state.province}`);
      render();
    });
  }
  document.querySelectorAll('[data-chart-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.chart-card');
      const canvas = card && card.querySelector('canvas');
      if (!canvas) return;
      state.chartMode[canvas.id] = button.dataset.chartTab;
      card.querySelectorAll('[data-chart-tab]').forEach((b) => b.classList.toggle('active', b === button));
      drawCharts(route);
    });
  });
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      else { state.sortKey = key; state.sortDir = 'asc'; }
      render();
    });
  });
  const search = document.getElementById('data-search');
  if (search) {
    search.addEventListener('input', () => {
      state.query = search.value;
      const start = search.selectionStart;
      render();
      const again = document.getElementById('data-search');
      if (again) { again.focus(); again.setSelectionRange(start, start); }
    });
  }
  // Tandai tab grafik aktif sesuai state.
  document.querySelectorAll('.chart-card').forEach((card) => {
    const canvas = card.querySelector('canvas');
    const mode = (canvas && state.chartMode[canvas.id]) || 'line';
    card.querySelectorAll('[data-chart-tab]').forEach((b) => b.classList.toggle('active', b.dataset.chartTab === mode));
  });
}

const TITLES = {
  '': 'Portal Statistik Nusara',
  penduduk: 'Penduduk',
  ekonomi: 'Ekonomi',
  'tenaga-kerja': 'Tenaga Kerja',
  harga: 'Harga dan Inflasi',
  kesehatan: 'Kesehatan',
  pendidikan: 'Pendidikan',
  lingkungan: 'Lingkungan',
  wilayah: 'Statistik Wilayah',
  data: 'Penjelajah Data',
  tentang: 'Tentang Portal Ini',
};

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const [pathPart, queryPart] = hash.slice(2).split('?');
  const route = pathPart || '';
  const params = new URLSearchParams(queryPart || '');
  if (params.get('provinsi')) state.province = params.get('provinsi');
  if (!PROVINCES.some((p) => p.slug === state.province)) state.province = 'andara';

  let html;
  if (route === '') html = views.home(state.year);
  else if (route === 'penduduk') html = views.penduduk(state.year);
  else if (route === 'ekonomi') html = views.ekonomi(state.year);
  else if (route === 'tenaga-kerja') html = views.tenagaKerja(state.year);
  else if (route === 'harga') html = views.harga(state.year);
  else if (route === 'kesehatan') html = views.kesehatan(state.year);
  else if (route === 'pendidikan') html = views.pendidikan(state.year);
  else if (route === 'lingkungan') html = views.lingkungan(state.year);
  else if (route === 'wilayah') html = views.wilayah(state.province);
  else if (route === 'data') html = views.dataExplorer({ year: state.year, query: state.query, sortKey: state.sortKey, sortDir: state.sortDir });
  else if (route === 'tentang') html = views.tentang();
  else html = views.missing();

  document.title = TITLES[route] ? `${TITLES[route]} | Portal Statistik Nusara` : 'Tidak Ditemukan | Portal Statistik Nusara';
  app.innerHTML = html;
  document.querySelectorAll('#nav-list a').forEach((a) => {
    const target = a.getAttribute('href').slice(2).split('?')[0];
    a.classList.toggle('active', target === route);
  });
  bindControls(route);
  drawCharts(route);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', (event) => {
    if (event.target.closest('a')) navList.classList.remove('open');
  });
}

window.addEventListener('hashchange', render);
render();
