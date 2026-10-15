# Finances citoyennes

Première version d’un site de vulgarisation des finances publiques canadiennes.

Interface React et TypeScript sur le starter Vinext de Sites. Le portrait du Québec utilise les Comptes publics 2024–2025, volume 1, pages imprimées 64 et 81. Les trois exercices de synthèse sont 2022–2023, 2023–2024 et 2024–2025; les ventilations détaillées portent sur 2024–2025. Les portraits Canada et Montréal sont explicitement à venir.

Les montants du fichier `lib/financial-data.ts` sont en millions de dollars canadiens. Le regroupement « Autres portefeuilles et programmes » est calculé par différence. Les graphiques présentent des dollars courants. Aucun classement politique ni score de performance des services n’est calculé.

## Développement

Node.js >= 22.13.0 requis. Utiliser les scripts d’installation et de build Sites. `npm run dev` lance l’aperçu local. `node --experimental-strip-types scripts/verify-financial-data.mjs` vérifie les identités comptables et les sommes des ventilations. `node node_modules/typescript/bin/tsc --noEmit` vérifie TypeScript.

Fonctions : navigation par palier, choix de l’exercice, cinq vues financières, export CSV, définitions dépliables et sources officielles. Aucune collecte de données personnelles, aucun compte utilisateur, aucune mise à jour automatique.
