# Dashboard local Prismia (mode B — compositeur)

Cockpit **local** pour composer les briefs de présentation. **Aucune clé / API** : la génération
du HTML se fait dans **Claude Code** (ta session = tes tokens). Ce serveur ne fait que
lire/écrire des `.md` locaux + servir l'interface. Modules **Node natifs uniquement** (zéro npm install).

## Lancer
```bash
node dashboard/server.js
```
Puis ouvrir **http://localhost:4317** (**Chrome** recommandé pour la dictée audio Web Speech).
Port configurable : `PORT=4400 node dashboard/server.js`.

## Ce qu'il fait
- Liste les **opportunités** (lues dans `knowledge/prospects/*.md`) + **créer** une opportunité.
- Par opportunité : choisir un **type** (R1 Découverte / Pilote / Carto), saisir **texte libre**
  + **audio dicté** (Web Speech) + **fichiers de contexte** (uploadés dans `clients/<slug>/context/`).
- **« Composer le brief »** → écrit `clients/<slug>/<slug>-<type>.md` puis lance l'agent.
- **Galerie** des decks (un dossier `clients/<slug>/` par entreprise) : **Ouvrir** le deck,
  **Exporter PDF** (le `.pdf` est rangé dans le dossier client **et** téléchargé directement).

## Tout au même endroit : `clients/<slug>/`
Brief, deck et PDF d'une entreprise vivent dans **un seul dossier** :
`clients/<slug>/<slug>-<type>.md` (brief) · `<slug>-<type>.html` (deck) · `<slug>-<type>.pdf` (PDF).

## Générer la présentation (dans Claude Code)
Après « Composer le brief », l'agent `prismia-deck` est lancé dans ta session (gate / lookup /
génération) → produit `clients/<slug>/<slug>-<type>.html`. Sinon, à la main :
> « génère le brief `clients/<slug>/<slug>-<type>.md` »

## Pré-requis
Node ≥ 18. Pas de dépendance npm, pas de clé API.

## Distribution (multi-utilisateurs)
**Repo Git** : chaque coéquipier clone le dossier, lance `node dashboard/server.js`, et génère
via **son propre Claude Code** (ses tokens). Knowledge & templates partagés via le repo ;
pipeline via Notion (Phase 2). Voir `../DASHBOARD.md` §11.
