import { records, revenueItems, expenseItems, source } from './financial-data.ts';

export const sections = ['ensemble', 'revenus', 'depenses', 'dette', 'tableaux'] as const;
const territories = { quebec: 'Québec', canada: 'Canada', montreal: 'Montréal' } as const;
export type View = { jurisdiction: string; year: number; tab: number };
export const defaultView: View = { jurisdiction: 'Québec', year: records.length - 1, tab: 0 };
export const detailedYear = records.findIndex(record => record.year === '2024–2025');

export function readView(search: string): View {
  const params = new URLSearchParams(search);
  const year = records.findIndex(record => record.year.replace('–', '-') === params.get('annee'));
  const tab = sections.findIndex(section => section === params.get('vue'));
  const territory = params.get('territoire');
  return {
    jurisdiction: territory && Object.hasOwn(territories, territory)
      ? territories[territory as keyof typeof territories] : defaultView.jurisdiction,
    year: year < 0 ? defaultView.year : year,
    tab: tab < 0 ? defaultView.tab : tab,
  };
}

export function viewUrl(href: string, view: View): string {
  const url = new URL(href);
  const territory = Object.entries(territories).find(([, name]) => name === view.jurisdiction)?.[0] || 'quebec';
  url.searchParams.set('territoire', territory);
  url.searchParams.set('annee', records[view.year].year.replace('–', '-'));
  url.searchParams.set('vue', sections[view.tab]);
  return url.href;
}

export function variation(current: number, previous?: number) {
  if (previous === undefined) return null;
  const amount = current - previous;
  return { amount, percent: previous === 0 ? null : amount / Math.abs(previous) * 100 };
}

const indicators = [
  ['Revenus', 'revenue'], ['Dépenses', 'expense'], ['Solde comptable', 'balance'],
  ['Dette nette', 'debt'], ['Actifs financiers', 'assets'], ['Passifs', 'liabilities'],
] as const;
type CsvRow = (string | number)[];
const report = 'Comptes publics du Québec 2024–2025, volume 1';
const note = 'Dollars courants. Historique retraité dans le même rapport. Les variations ne mesurent pas la qualité des services.';

function totals(year: number, keys?: readonly string[]): CsvRow[] {
  const record = records[year];
  const previous = records[year - 1];
  return indicators.filter(([, key]) => !keys || keys.includes(key)).map(([name, key]) => {
    const change = variation(record[key], previous?.[key]);
    return ['Québec', record.year, 'Synthèse', name, record[key], 'millions CAD', '',
      change?.amount ?? '', change?.percent ?? '', previous?.year ?? '',
      'Résultat réel', report, 'Tableau 1.1, p. 64', source + '#page=73', '', note];
  });
}

function breakdown(kind: 'revenus' | 'depenses'): CsvRow[] {
  const record = records[detailedYear];
  const items = kind === 'revenus' ? revenueItems : expenseItems;
  const total = kind === 'revenus' ? record.revenue : record.expense;
  return items.map(([name, amount]) => ['Québec', record.year,
    kind === 'revenus' ? 'Ventilation des revenus' : 'Ventilation des dépenses',
    name, amount, 'millions CAD', amount / total * 100, '', '', '', 'Résultat réel',
    report, 'État des résultats, p. 81', source + '#page=90',
    name === 'Autres portefeuilles et programmes' ? 'Calculé par différence' : '',
    'Ventilation disponible uniquement pour 2024–2025. Parts calculées avant arrondi.']);
}

function budget(): CsvRow[] {
  return [
    ['Déficit comptable prévu', 8800, 'Prévision'],
    ['Déficit comptable constaté', 5200, 'Résultat réel'],
    ['Provision pour éventualités', 1500, 'Prévision'],
    ['Déficit comptable en moins que prévu', 3600, 'Écart calculé'],
  ].map(([name, amount, nature]) => ['Québec', records[detailedYear].year, 'Budget et résultats',
    name, amount, 'millions CAD', '', '', '', '', nature,
    report, 'État des résultats, p. 81', source + '#page=90',
    'Arrondi à 0,1 milliard', 'Montants arrondis affichés dans le portrait; consulter la source pour la précision originale.']);
}

export function exportRows(view: View, complete = false): CsvRow[] {
  if (complete) return [...records.flatMap((_, year) => totals(year)), ...breakdown('revenus'), ...breakdown('depenses'), ...budget()];
  if (view.tab === 4) return records.flatMap((_, year) => totals(year));
  if (view.tab === 3) return totals(view.year, ['debt', 'assets', 'liabilities']);
  if (view.tab === 1 || view.tab === 2) {
    const kind = view.tab === 1 ? 'revenus' : 'depenses';
    const totalRows = totals(view.year, [view.tab === 1 ? 'revenue' : 'expense']);
    if (view.year !== detailedYear) totalRows.forEach(row => { row[15] += ' Ventilation de cet exercice non intégrée; total uniquement.'; });
    return [...totalRows,
      ...(view.year === detailedYear ? breakdown(kind) : [])];
  }
  // The overview also displays the three-year revenues/expenses chart.
  return [...totals(view.year), ...records.flatMap((_, year) => year === view.year ? [] : totals(year, ['revenue', 'expense'])),
    ...(view.year === detailedYear ? [...breakdown('depenses'), ...budget()] : [])];
}

function csvCell(value: string | number): string {
  let text = typeof value === 'number' ? String(value).replace('.', ',') : value;
  // Prevent spreadsheet formulas if a future source introduces such a label.
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function exportCsv(view: View, complete = false): string {
  const header = ['Territoire', 'Exercice', 'Catégorie', 'Indicateur', 'Montant', 'Unité',
    'Part du total (%)', 'Variation annuelle (millions CAD)', 'Variation annuelle (%)',
    'Exercice de comparaison', 'Nature', 'Publication', 'Tableau / page imprimée', 'Source URL', 'Traitement', 'Note'];
  return '\uFEFF' + [header, ...exportRows(view, complete)].map(row => row.map(csvCell).join(';')).join('\r\n') + '\r\n';
}
