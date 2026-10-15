import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../out/', import.meta.url));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const html = readFileSync(join(output, 'index.html'), 'utf8');
assert.ok(html.includes('Le Québec, en chiffres.'), 'Le portrait doit être présent dans le HTML exporté.');
assert.ok(html.includes('milliards $'), 'Les unités financières doivent être présentes.');
assert.ok(existsSync(join(output, '.nojekyll')), 'Le fichier .nojekyll doit être exporté.');
const assetUrls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]).filter(url => url.startsWith('/') && !url.startsWith('//'));
assert.ok(assetUrls.some(url => url.includes('/_next/')), 'Les ressources Next.js doivent être référencées.');
for (const url of assetUrls) {
  assert.ok(url.startsWith(`${basePath}/`), `Ressource hors du sous-dossier GitHub Pages : ${url}`);
  const local = decodeURIComponent(url.slice(basePath.length).split(/[?#]/)[0]);
  assert.ok(existsSync(join(output, local.replace(/^\//, ''))), `Ressource absente : ${url}`);
}
assert.ok(html.includes(`${basePath}/favicon.svg`), 'Le favicon doit respecter le sous-dossier.');
console.log(`Export statique vérifié : ${assetUrls.length} ressources locales, chemin ${basePath || '/'}.`);
