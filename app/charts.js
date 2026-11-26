// Grafik kanvas tanpa pustaka eksternal: garis, batang, dan donat.
// Semua grafik digambar dari angka di data.js dan menyesuaikan lebar layar.
// Warna mengikuti palet situs: biru tua, emas, dan hijau.

const INK = '#123a5c';
const GRID = '#dbe4ea';
const MUTED = '#5b6b7a';
const BLUE = '#1b6ca8';
const GOLD = '#c9a227';
const GREEN = '#2e7d5b';
const TEAL = '#3f8f8a';
const ORANGE = '#d07a2d';
const PURPLE = '#6a5a9e';
const PALETTE = [BLUE, GOLD, GREEN, TEAL, ORANGE, PURPLE, '#8a6d3b', '#4a7a3a'];

function setupCanvas(canvas, height) {
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm < 1.5 ? mag : norm < 3.5 ? 2 * mag : norm < 7.5 ? 5 * mag : 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

function drawAxes(ctx, box, labels, min, max, formatValue) {
  const { lo, hi, ticks } = niceTicks(min, max);
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ticks.forEach((t) => {
    const y = box.top + box.height - ((t - lo) / (hi - lo)) * box.height;
    ctx.beginPath();
    ctx.moveTo(box.left, y);
    ctx.lineTo(box.left + box.width, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(formatValue(t), box.left - 6, y + 4);
  });
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = box.left + (box.width * (i + 0.5)) / labels.length;
    ctx.fillText(label, x, box.top + box.height + 16);
  });
  return { lo, hi };
}

// Grafik garis satu deret.
export function drawLine(canvas, labels, values, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas, options.height || 260);
  const color = options.color || BLUE;
  const formatValue = options.format || ((v) => String(v));
  const padLeft = options.padLeft || 48;
  const box = { left: padLeft, top: 12, width: width - padLeft - 12, height: height - 44 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const { lo, hi } = drawAxes(ctx, box, labels, min, max, formatValue);
  const pointX = (i) => box.left + (box.width * i) / (values.length - 1);
  const pointY = (v) => box.top + box.height - ((v - lo) / (hi - lo)) * box.height;
  ctx.beginPath();
  values.forEach((v, i) => { if (i === 0) ctx.moveTo(pointX(i), pointY(v)); else ctx.lineTo(pointX(i), pointY(v)); });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.lineTo(pointX(values.length - 1), box.top + box.height);
  ctx.lineTo(pointX(0), box.top + box.height);
  ctx.closePath();
  ctx.fillStyle = `${color}22`;
  ctx.fill();
  ctx.fillStyle = color;
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(pointX(i), pointY(v), 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  const last = values[values.length - 1];
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = INK;
  ctx.textAlign = 'right';
  ctx.fillText(formatValue(last), pointX(values.length - 1) - 6, pointY(last) - 10);
}

// Grafik garis dua deret untuk perbandingan.
export function drawLineTwo(canvas, labels, first, second, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas, options.height || 260);
  const formatValue = options.format || ((v) => String(v));
  const box = { left: 48, top: 12, width: width - 60, height: height - 44 };
  const all = [...first.values, ...second.values];
  const { lo, hi } = drawAxes(ctx, box, labels, Math.min(...all), Math.max(...all), formatValue);
  const pointX = (i) => box.left + (box.width * i) / (labels.length - 1);
  const pointY = (v) => box.top + box.height - ((v - lo) / (hi - lo)) * box.height;
  [[first, BLUE], [second, GOLD]].forEach(([series, color]) => {
    ctx.beginPath();
    series.values.forEach((v, i) => { if (i === 0) ctx.moveTo(pointX(i), pointY(v)); else ctx.lineTo(pointX(i), pointY(v)); });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = color;
    series.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(pointX(i), pointY(v), 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = BLUE;
  ctx.fillText(`\u25CF ${first.label}`, box.left, height - 6);
  ctx.fillStyle = GOLD;
  ctx.fillText(`\u25CF ${second.label}`, box.left + 150, height - 6);
}

// Grafik batang.
export function drawBar(canvas, labels, values, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas, options.height || 260);
  const formatValue = options.format || ((v) => String(v));
  const color = options.color || BLUE;
  const box = { left: 48, top: 12, width: width - 60, height: height - 44 };
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const { lo, hi } = drawAxes(ctx, box, labels, min, max, formatValue);
  const slot = box.width / values.length;
  const barWidth = Math.min(46, slot * 0.62);
  values.forEach((v, i) => {
    const x = box.left + slot * i + (slot - barWidth) / 2;
    const y = box.top + box.height - ((v - lo) / (hi - lo)) * box.height;
    const base = box.top + box.height - ((0 - lo) / (hi - lo)) * box.height;
    ctx.fillStyle = Array.isArray(color) ? color[i % color.length] : color;
    ctx.fillRect(x, Math.min(y, base), barWidth, Math.abs(base - y));
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.fillText(formatValue(v), x + barWidth / 2, Math.min(y, base) - 5);
  });
}

// Grafik donat dengan legenda.
export function drawDonut(canvas, items, options = {}) {
  const size = options.size || 220;
  const { ctx, width } = setupCanvas(canvas, size);
  const cx = 110;
  const cy = size / 2;
  const radius = Math.min(86, size / 2 - 14);
  const total = items.reduce((sum, item) => sum + item.share, 0);
  let angle = -Math.PI / 2;
  items.forEach((item, i) => {
    const sweep = (item.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.fillText(options.center || '', cx, cy - 2);
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(options.centerSub || '', cx, cy + 15);
  // Legenda di kanan donat.
  const legendX = 215;
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  items.forEach((item, i) => {
    const y = 24 + i * 22;
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fillRect(legendX, y - 9, 12, 12);
    ctx.fillStyle = INK;
    ctx.fillText(`${item.name} — ${item.share}%`, legendX + 18, y + 2);
  });
  return width;
}
