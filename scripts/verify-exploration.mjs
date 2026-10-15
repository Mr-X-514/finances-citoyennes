import assert from 'node:assert/strict';
import { records } from '../lib/financial-data.ts';
import { defaultView, detailedYear, readView, viewUrl, variation, exportRows, exportCsv } from '../lib/exploration.ts';

const origin = 'https://mr-x-514.github.io/finances-citoyennes/';
const view = { jurisdiction: 'Québec', year: 1, tab: 3 };
const shared = new URL(viewUrl(origin + '?campagne=test#sources', view));
assert.equal(shared.pathname, '/finances-citoyennes/');
assert.equal(shared.hash, '#sources');
assert.equal(shared.searchParams.get('campagne'), 'test');
assert.deepEqual(readView(shared.search), view);
assert.deepEqual(readView('?annee=1999&vue=incorrecte&territoire=toString'), defaultView);
assert.deepEqual(readView('?territoire=montreal&annee=2022-2023&vue=depenses'), { jurisdiction: 'Montréal', year: 0, tab: 2 });
for (const jurisdiction of ['Québec', 'Canada', 'Montréal']) {
  for (let year = 0; year < records.length; year++) {
    for (let tab = 0; tab < 5; tab++) {
      const selection = { jurisdiction, year, tab };
      assert.deepEqual(readView(new URL(viewUrl(origin, selection)).search), selection);
    }
  }
}

assert.equal(variation(100), null);
assert.deepEqual(variation(100, 0), { amount: 100, percent: null });
assert.deepEqual(variation(0, 100), { amount: -100, percent: -100 });
assert.equal(variation(156088, 145541).amount, 10547);
assert.equal(variation(5175, 5994).amount, -819, 'Le déficit diminue de 819 millions, sans inverser le sens de la variation.');
assert.equal(variation(236163, 220016).amount, 16147);

const all = exportRows(defaultView, true);
assert.equal(all.length, 35, '18 valeurs de synthèse, 13 ventilations et 4 valeurs du budget comparé.');
assert.ok(all.every(row => row.length === 16 && row[5] === 'millions CAD' && row[13].startsWith('https://')));
for (const category of ['Ventilation des revenus', 'Ventilation des dépenses']) {
  const rows = all.filter(row => row[2] === category);
  const expected = category.endsWith('revenus') ? 156088 : 161263;
  assert.equal(rows.reduce((total, row) => total + row[4], 0), expected);
  assert.ok(Math.abs(rows.reduce((total, row) => total + row[6], 0) - 100) < 1e-10);
  assert.ok(rows.every(row => row[1] === '2024–2025'));
}
assert.equal(all.find(row => row[3] === 'Autres portefeuilles et programmes')[14], 'Calculé par différence');
assert.ok(all.filter(row => row[2] === 'Budget et résultats').every(row => row[14].includes('Arrondi')));
const firstYear = all.filter(row => row[1] === records[0].year);
assert.ok(firstYear.every(row => row[7] === '' && row[8] === '' && row[9] === ''));
for (let year = 0; year < records.length; year++) {
  for (let tab = 0; tab < 5; tab++) {
    const rows = exportRows({ ...defaultView, year, tab });
    if (year !== detailedYear) assert.ok(rows.every(row => !String(row[2]).startsWith('Ventilation') && row[2] !== 'Budget et résultats'));
    if (tab === 1 || tab === 2 || tab === 3) assert.ok(rows.every(row => row[1] === records[year].year));
    if (tab === 3) assert.equal(rows.length, 3);
    if (tab === 4) assert.equal(rows.length, 18);
  }
}
const csv = exportCsv(defaultView, true);
assert.ok(csv.startsWith('\uFEFF"Territoire";'));
assert.equal(csv.split('\r\n').filter(Boolean).length, 36);
assert.ok(csv.includes('"-5175"'), 'Le solde négatif reste numérique.');
assert.ok(csv.includes('"État des résultats, p. 81"'));
assert.ok(csv.includes('"millions CAD"'));
console.log('Exploration vérifiée : liens de 45 vues, variations, couverture et cohérence des exports CSV.');
