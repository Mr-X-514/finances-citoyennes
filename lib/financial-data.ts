// Millions CAD. Comptes publics 2024–2025, volume 1, p. 64 et 81.
export const source='https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/finances/publications-adm/Comptes-publics/FR/CPTFR_vol1-2024-2025.pdf';
export const records=[
 {year:'2022–2023',revenue:144243,expense:147369,balance:-3126,debt:208820,assets:134607,liabilities:343427},
 {year:'2023–2024',revenue:145541,expense:151535,balance:-5994,debt:220016,assets:155680,liabilities:375696},
 {year:'2024–2025',revenue:156088,expense:161263,balance:-5175,debt:236163,assets:152879,liabilities:389042}
];
export const revenueItems=[['Impôts sur le revenu et les biens',69081],['Transferts fédéraux',30498],['Taxes à la consommation',28377],['Revenus divers',16252],['Droits, permis et redevances',6191],['Entreprises du gouvernement',5689]] as const;
export const expenseItems=[['Santé et services sociaux',64195],['Éducation',23352],['Autres portefeuilles et programmes',35665],['Enseignement supérieur',11383],['Service de la dette',9969],['Famille',9015],['Transports et mobilité durable',7684]] as const;
export const money=(n:number,digits=1)=>(n/1000).toLocaleString('fr-CA',{minimumFractionDigits:digits,maximumFractionDigits:digits});
