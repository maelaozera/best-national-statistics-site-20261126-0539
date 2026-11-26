// Entry point Portal Statistik Nusara (Node 22, standard library only).
//
// Situsnya adalah berkas statis di app/ yang dibuka browser di app/index.html
// (modul ES, CSS, tanpa build step) dan tidak memuat apa pun dari jaringan.
// Program ini menyerahkan situs itu: menyalin app/ dan screenshots/ dari
// sebelah berkas ini ke /output lalu menulis /output/dossier.json, ringkasan
// yang dibaca juri (screenshot, berkas dan byte first load, dan sumber),
// memakai pustaka make.fun yang divendor. Biarkan vendor/makefun-frontend.ts
// apa adanya: scorer mengharuskan dossier.json sama persis dengan yang
// ditulis salinan pustaka miliknya.
//
// Menjalankan lokal dengan `node serve.ts`, lalu buka http://localhost:8080.
// Di luar container grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas-batas scorer (reference/gate.json): hanya text_max_bytes yang
// membentuk byte; sisanya menolak entry yang scorer juga tolak (lebih dari
// 4 screenshot atau satu di atas 256 KiB; lebih dari 993 berkas dan direktori
// di app/ atau 16 MiB berkas app/: app/ dihitung bersama batas 1000 entri
// /output, screenshot dan dossier.json-nya).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
