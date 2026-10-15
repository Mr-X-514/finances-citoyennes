# Finances citoyennes

Première version d’un site de vulgarisation des finances publiques canadiennes.

Interface React et TypeScript, avec un export statique Next.js pour GitHub Pages et une configuration Vinext pour l’hébergement Sites existant. Le portrait du Québec utilise les Comptes publics 2024–2025, volume 1, pages imprimées 64 et 81. Les trois exercices de synthèse sont 2022–2023, 2023–2024 et 2024–2025; les ventilations détaillées portent sur 2024–2025. Les portraits Canada et Montréal sont explicitement à venir.

Les montants du fichier `lib/financial-data.ts` sont en millions de dollars canadiens. Le regroupement « Autres portefeuilles et programmes » est calculé par différence. Les graphiques présentent des dollars courants. Aucun classement politique ni score de performance des services n’est calculé.

## Développement

Installer la version de Node.js indiquée dans `.nvmrc`, puis :

```sh
npm ci
npm run dev:pages
```

Ouvrir l’adresse affichée par Next.js. Les données sont chargées à la compilation; aucun serveur de données ni compte ChatGPT n’est nécessaire pour la version GitHub Pages.

```sh
npm run check:data
npm run typecheck
npm run build:pages
```

La dernière commande produit le dossier `out/`, prêt pour un hébergement statique, et vérifie que ses ressources locales existent. Sans variable d’environnement, le site est construit pour la racine du domaine.

Pour simuler l’adresse prévue sur GitHub Pages dans PowerShell :

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/finances-citoyennes'
npm run build:pages
```

Dans un shell Unix : `NEXT_PUBLIC_BASE_PATH=/finances-citoyennes npm run build:pages`. Les URL de scripts, de styles et du favicon doivent toutes inclure ce préfixe. Le fichier `public/.nojekyll` est copié dans l’export.

## Publication GitHub Pages

Dépôt cible : `Mr-X-514/finances-citoyennes`. Adresse prévue après activation et premier déploiement réussi : `https://Mr-X-514.github.io/finances-citoyennes/`.

1. Envoyer le contenu de ce dossier à la racine du dépôt, sur la branche `main`.
2. Dans les paramètres GitHub du dépôt, ouvrir **Pages**, puis choisir **GitHub Actions** comme source de publication.
3. Lancer **Publier sur GitHub Pages** dans l’onglet **Actions**, ou envoyer un nouveau commit sur `main`.

Le workflow `.github/workflows/pages.yml` installe les dépendances verrouillées, vérifie les données et TypeScript, compile le site, vérifie les chemins des ressources, puis déploie uniquement le dossier `out/`. Il utilise les autorisations temporaires de GitHub Actions; aucun jeton personnel n’est à enregistrer dans le dépôt. Le chemin de base provient de la configuration Pages et s’adapte à un dépôt de projet ou à un domaine personnalisé.

La disponibilité de GitHub Pages pour un dépôt privé dépend du forfait GitHub. La visibilité du dépôt et celle du site doivent être choisies lors de sa création.

## Hébergement Sites existant

Les commandes `npm run dev` et `npm run build` conservent le fonctionnement Vinext/Sites. L’export GitHub Pages utilise séparément `npm run dev:pages` et `npm run build:pages`. Les modules de connexion ChatGPT et Cloudflare du starter ne sont pas utilisés par la page publique statique.

Fonctions : navigation par palier, choix de l’exercice, cinq vues financières, export CSV, définitions dépliables et sources officielles. Aucune collecte de données personnelles, aucun compte utilisateur, aucune mise à jour automatique.
