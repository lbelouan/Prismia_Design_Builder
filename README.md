# Prismia — Générateur de présentations RDV1

Outil interne **Prismia** (conseil en IA) pour industrialiser la création de présentations HTML
de **premier rendez-vous** client, fidèles à la direction artistique (boule 3D violette,
glassmorphism), exportables en PDF.

Le cœur du système : un **dashboard local** où tu décris la situation client (transcript du
cold-call, contexte, site web…), un **agent d'enrichissement** vérifie l'entreprise (recherche
web), puis l'**agent `prismia-deck` génère le deck dans TA session Claude Code**.

> **Aucune clé API.** La génération et la recherche tournent sur **ta propre session Claude Code**
> (tes tokens). Le serveur ne fait que lire/écrire des fichiers locaux et appeler le CLI `claude`.

---

## Prérequis

| Outil | Pourquoi | Vérifier |
|-------|----------|----------|
| **Node.js ≥ 18** | serveur dashboard (modules natifs) + export PDF | `node -v` |
| **Claude Code CLI**, connecté | génération du deck + enrichissement (ta session = tes tokens) | `claude --version` |
| **Google Chrome** (ou Chromium / Edge) | export PDF (screenshots via puppeteer-core) | — |
| **Python 3** | scripts du skill `ui-ux-pro-max` | `python3 --version` |
| Accès internet | polices Google + Three.js CDN (sinon repli, la boule s'affiche quand même) | — |

Le CLI `claude` doit être **installé et authentifié** (`claude` ouvrable dans un terminal). Voir
<https://docs.claude.com/claude-code>. C'est lui qui consomme **ta** session — rien n'est facturé
côté serveur.

---

## Installation

```bash
git clone <url-du-repo>
cd Projet_templateR1
cd tools && npm install && cd ..   # installe puppeteer-core (export PDF)
```

Rien d'autre à installer : le serveur du dashboard n'utilise que des modules Node natifs.

---

## Lancer le dashboard

```bash
node dashboard/server.js
```

Puis ouvre **http://localhost:4317** (**Chrome** recommandé pour la dictée audio Web Speech).
Port configurable : `PORT=4400 node dashboard/server.js`.

---

## Utilisation (flux)

1. **Nouvelle présentation** : société, site web (optionnel), **date du RDV**, type de scénario
   (Découverte / Pilote / Carto), transcript du cold-call (dicté ou collé), contexte additionnel.
2. **Enrichir le contexte** *(optionnel)* : l'agent vérifie l'entreprise (recherche web), produit
   un contexte **secondaire** (jamais prioritaire sur ton transcript), éditable, pris en compte d'office.
3. **Composer le brief & lancer l'agent** : écrit le brief dans `clients/<slug>/` et lance
   `prismia-deck` **dans ta session Claude**. S'il manque des infos (dont la date du RDV), il les
   demande dans le chat ; sinon il génère le deck `clients/<slug>/<slug>-<type>.html`.
4. **Chat agent** : affine le deck (texte dicté + **pièces jointes** lues par l'agent).
5. **Decks créés** : ouvre le deck, **Exporter / Télécharger PDF** (enregistré dans le dossier de
   l'entreprise **et** téléchargé). La slide « Territoires » produit 1 page PDF par onglet.

Tout ce qui concerne une entreprise vit dans **un seul dossier** `clients/<slug>/` (brief + deck +
PDF + contexte + pièces). Ce contenu est **git-ignoré** : le repo reste un template vierge, chacun
génère le sien.

---

## Génération sans le dashboard (Claude Code direct)

Décris une situation de premier RDV dans Claude Code (« prépare une présentation pour … ») : le
skill `prismia-deck` s'active et suit le flux (lookup → fiche prospect → gate de complétude →
génération). Ou pointe un brief existant : « génère le brief `clients/<slug>/<slug>-<type>.md` ».

---

## Structure

```
CLAUDE.md            contexte + règles + trame (lu par Claude à chaque session)
WORKFLOW.md          process audio → HTML (gate, lookup, fiche prospect)
DASHBOARD.md         spec du cockpit local
knowledge/           connaissance Prismia (info pure) — company/offers/methodology/case-studies/pricing
  prospects/         1 fiche par prospect (auto) — seul _TEMPLATE.md est versionné
design/              direction artistique (DESIGN.md, design-system.md, bundle de référence)
templates/           r1-premier-rdv.html (template mono-fichier auto-contenu)
scenarios/           encapsulation knowledge → slides (_socle + r1-decouverte/pilote/carto)
clients/             sorties par entreprise (git-ignoré) : brief + deck + pdf + contexte
tools/               export-pdf.mjs (puppeteer-core) — seul dossier avec une dépendance npm
dashboard/           cockpit local (serveur Node natif + SPA) — node dashboard/server.js
.claude/skills/      prismia-deck (orchestrateur) + ui-ux-pro-max (qualité UX)
```

---

## Dépannage

- **« CLI claude introuvable »** : `claude` n'est pas dans le PATH ou pas connecté. Ouvre un
  terminal, lance `claude`, connecte-toi, réessaie.
- **Export PDF « Chrome introuvable »** : installe Google Chrome, ou définis le binaire :
  `CHROME_PATH="/chemin/vers/chrome" node dashboard/server.js`.
- **Dictée audio absente** : utilise Chrome (Web Speech API).
- **Polices/3D** : si pas d'internet, la typo retombe sur un repli et la boule CSS s'affiche
  quand même (aucune dépendance WebGL).
