# DASHBOARD — Spécification (cockpit de génération de présentations)

> ⚠️ **Spec uniquement — rien n'est encore construit.** On fige la structure et le modèle de
> données ; le build viendra après validation du **fork central** (§7).

## 0. Contraintes clés (verrouillées par Timeo)
- **Aucune clé d'API Anthropic.** La génération des présentations utilise **les tokens de la
  session Claude** (elle tourne **dans Claude Code**, mode B). Le dashboard **n'appelle jamais**
  l'API Anthropic.
- **Notion en LECTURE** via le **connecteur MCP Notion de Claude Code** (OAuth — **pas de clé en
  dur**). Un **agent Notion** lit les pages autorisées et **toutes les opportunités**.
- **Refresh quotidien** (~1×/jour) : une **routine planifiée dans Claude Code** lit le pipeline
  Notion (MCP) et **rafraîchit un miroir local** (1 `.md` par opportunité/entreprise) → le
  dashboard a la visibilité **sans secret ni réseau en direct**.
- **Knowledge boîte = local en `.md`** : `company / offers / methodology / case-studies /
  pricing`. **Le pipeline (opportunités) = Notion** (miroir local en lecture).
- **Audio du dashboard** (Web Speech) → enregistre un **fichier de contexte `.md`** pour
  l'entreprise/opportunité concernée, **dans le dossier local**.
- Conséquence : **aucun secret dans le dashboard** ; il ne fait que **lire/écrire des `.md`
  locaux** + composer des briefs. Claude Code (session + MCP) fait la génération et la lecture Notion.

## 1. Objectif
Un cockpit visuel pour piloter la production des présentations :
1. **Voir / créer** une opportunité (client) dans le pipeline.
2. **Choisir un type** de présentation (boutons) — chacun a une **trame de texte** un peu différente.
3. **Donner le contexte** : **audio** (dicté), **fichiers** (n'importe quel format), **texte** libre (« ce qu'on veut faire »).
4. Un **agent** se lance, vérifie la complétude, **pose des questions** si besoin, **cherche sur
   Notion** (le prospect existe-t-il ?), **cherche dans le knowledge interne**, puis **génère** le HTML.
5. **Retrouver / visualiser** les decks produits (galerie).

## 2. Types de présentations
- **Maintenant (RDV1)** — 3 variantes de **trame/texte** (même DA, même template visuel) :
  - **R1 Découverte** : premier contact large — comprendre le contexte, poser le diagnostic,
    montrer la valeur. *(≈ la trame actuelle, généraliste.)*
  - **R1 Pilote** : orienté **cadrage d'un pilote** — périmètre, quick wins, ROI, planning
    ~4 semaines, proposition concrète appuyée.
  - **R1 Carto** : orienté **audit / cartographie** — diagnostic des processus en profondeur,
    plateforme propriétaire, livrable roadmap impact/effort.
  > ✅ Approche validée (2026-05-25) : **même template ré-angé** par scénario. Détail
  > slide-par-slide = **playbook scénario** dans `.claude/skills/prismia-deck/SKILL.md`.
- **Plus tard** : `R2`, `R3`, `Proposition commerciale`, `Devis`, `Facturation`.
- Implémentation : 1 type = un **profil de trame** (quels blocs, quel angle) ; le visuel reste
  le template commun. Concrètement, un type pourra être un préréglage de slides + de ton.

## 3. Sources de vérité (le point que tu as insisté)
- **Notion = source de vérité des CLIENTS / OPPORTUNITÉS** (pipeline, étapes, comptes-rendus).
  → Le dashboard en affiche une **vision EN LECTURE SEULE** + un **bouton « Actualiser »** (pull).
  Il **n'écrit pas** dans Notion par défaut (on ne corrompt jamais la source). Un *write-back*
  (lien de deck, statut) reste **optionnel et explicite**, plus tard.
- **Repo = source de vérité de la CONNAISSANCE Prismia** : `company / offers / methodology` **et
  les cas de référence (`case-studies.md`)** — ces **cas de référence restent internes, PAS sur
  Notion**.
- **Fiches `knowledge/prospects/*.md`** = **cache local** des opportunités (miroir de Notion au
  pull) + endroit où l'agent écrit le contexte d'un nouveau prospect.
- Règle anti-conflit : **Notion gagne** pour la donnée client ; **le repo gagne** pour la
  connaissance Prismia. Pas de merge bidirectionnel.

## 4. Modèle de données (contrat figé)
Opportunité = 1 page Notion ↔ 1 fiche `knowledge/prospects/<slug>.md`.

| Notion (propriété)   | type            | .md (frontmatter / section)        |
|----------------------|-----------------|------------------------------------|
| Société              | Title           | `company`                          |
| Slug                 | Text            | `slug`                             |
| Secteur              | Select          | `sector`                           |
| Étape                | Select          | `stage`                            |
| Statut commercial    | Select          | `status` (prospect / signé)        |
| Interlocuteur(s)     | Text / Relation | section « Interlocuteur(s) »        |
| Maturité IA          | Text            | section « Contexte / maturité IA » |
| Constat / enjeu      | Text            | section « Constat / enjeu »         |
| Pistes / cas d'usage | Multi-select    | section « Pistes »                  |
| Cas de réf. matchés  | Text            | section « Cas matchés »             |
| Comptes-rendus RDV   | Text / sous-pages | section « Historique RDV »        |
| Decks générés        | Files / URL     | section « Historique RDV » (`clients/<slug>/`) |
| Créé / MAJ           | Date            | `created` / `updated`              |

**Étapes (`stage`)** : `Prospection → RDV1 prévu → RDV1 fait → RDV2 → Proposition → Signé / Perdu`.

## 5. Flux « agent au clic » (après l'audio + fichiers facultatifs)
1. **Recherche web sur l'entreprise** (`WebSearch` — via la **session**, sans clé) : secteur,
   taille, actualité, enjeux. *(API tierces de données société à évaluer plus tard si besoin.)*
2. **Lookup knowledge interne** (`company/offers/methodology/case-studies` + fiche prospect) +
   **liaison des cas de référence** pertinents. *(Notion en lecture : plus tard, avec clés.)*
3. **Complétude** : si données insuffisantes → **pose des questions** ; n'avance pas sans deck propre.
4. **Générer** le HTML du **type** choisi (clone-and-fill du template).
5. **Écrire / MAJ la fiche** `knowledge/prospects/<slug>.md`.

## 6. Vues du dashboard (3 pages — implémentées)
1. **Nouvelle présentation** (RDV1) : **Société** (+ datalist des sociétés connues) · **3 types**
   (Découverte / Pilote / Carto) · **audio** (gros micro Web Speech) **ou transcript collé** du
   cold-call · précisions · **fichiers facultatifs** → **« Composer le brief & lancer l'agent »**
   (écrit `clients/<slug>/<slug>-<type>.md`).
2. **Knowledge entreprise** : les `.md` boîte (`company / offers / methodology / case-studies /
   pricing`) **affichés et éditables** → sauvegarde directe dans `knowledge/<fichier>.md`.
3. **Decks créés** : galerie (ouvrir).
- **Pas de vue pipeline / opportunités** (recentrage RDV1).
- **Export PDF** ✅ **FAIT** : `tools/export-pdf.mjs` (screenshot de chaque slide après la fin de
  son animation → 1 PDF 16:9). Bouton dans la galerie + en fin de chat agent ; le `.pdf` est rangé
  dans `clients/<slug>/` **et** téléchargé directement.

## 7. ⚙️ FORK CENTRAL — comment l'agent tourne derrière le bouton (à trancher)
Un bouton web ne peut pas invoquer Claude Code directement. Deux options :
- **A · App agentique** : un **backend Node** exécute la logique `prismia-deck` via le **Claude
  Agent SDK** (vérif → questions → recherche → génération). Dashboard **pleinement automatisé**.
  *Coût* : backend + secrets (Anthropic/Notion) + transcription audio + parsing fichiers + hosting.
- **B · Compositeur de brief (léger)** : le dashboard **prépare le brief** (type + audio transcrit
  + fichiers de contexte écrits dans le projet) ; **Claude Code génère** ensuite (toi qui lances).
  *Coût* : faible, semi-manuel, reste dans l'esprit « dossier + agent dans l'éditeur ».

→ **DÉCISION : option B retenue** (compositeur, local-first). Audio = **Web Speech API**
(navigateur, sans clé). Le dashboard prépare un **brief** (`clients/<slug>/<slug>-<type>.md`) que
l'agent `prismia-deck` consomme dans Claude Code. **Pas** d'Agent SDK / secrets / hosting pour
le MVP — juste un **petit serveur local Node** pour lire les `.md` + `clients/` et écrire le brief.

## 8. Briques techniques (si option A)
- **Front** : SPA Vite + React + Tailwind, **reprenant la DA** (violet/verre).
- **Back** : Node — Agent SDK (génération) · Notion API (lecture) · **STT audio** (Web Speech
  navigateur *ou* Whisper/Deepgram) · **parsing fichiers** (PDF/pptx/img → texte) · **PDF par
  screenshots** (Playwright). Secrets **backend uniquement**.

## 9. Phasage proposé
- **Phase 0 (fait)** : modèle de données + spec.
- **Phase 1 — MVP (mode B, local)** ✅ **FAIT** → `dashboard/` (`node dashboard/server.js` →
  http://localhost:4317). Petit serveur **Node local** + **SPA** (DA violet/verre).
  Vues : liste des opportunités (lues dans `knowledge/prospects/`) + **création** ; **fiche** avec
  **boutons de type** (R1 Découverte / Pilote / Carto), **zone d'entrée** (texte + **audio Web
  Speech** + **upload fichiers** de contexte) ; bouton **« Composer le brief »** → écrit
  `clients/<slug>/<slug>-<type>.md` ; **galerie** des decks (`clients/<slug>/`). La **génération
  reste dans Claude Code** (l'agent `prismia-deck` lit le brief).
- **Phase 2** : lecture **Notion** via **connecteur MCP** (session, sans clé) + **refresh
  quotidien planifié** dans Claude Code → **miroir local** des opportunités (1 `.md` chacune).
  L'audio du dashboard enregistre un **contexte `.md`** par opportunité.
- **Phase 3** : passage en **mode A** (Agent SDK) + audio STT serveur + parsing fichiers + PDF.

## 10. Hors-scope maintenant
Pas de write-back Notion, pas de R2/R3/Proposition/Devis/Facturation (plus tard), pas de SaaS hébergé.

## 11. Déploiement & multi-utilisateurs (contrainte structurante)
**Objectif** : plusieurs personnes utilisent l'app, chacune avec **ses propres tokens de session
Claude** (pas de clé API), et le dossier (templates + knowledge) est embarqué.

**Vérité technique :**
- Une **app web hébergée** (un seul site) **ne peut PAS** utiliser l'abonnement Claude de chaque
  visiteur pour l'inférence. L'auth d'abonnement (Claude Code / claude.ai) est **locale à chaque
  personne** ; côté serveur, seule l'**API Anthropic (= une clé, facturée au détenteur)** marche
  — ce que tu refuses. → **« hébergé + tokens de session de chacun » = impossible.**

**Modèle viable (retenu) : app LOCALE distribuable.**
- Chaque coéquipier **exécute l'app en local**, à côté de **son propre Claude Code** (connecté à
  **son** abonnement). La génération tourne dans **sa** session = **ses** tokens. ✔ aucune clé.
- Le **dossier** (templates, knowledge, dashboard, petit serveur local) est **embarqué** dans la distribution.
- **« Déploiement » = distribution**, pas hébergement. Formes possibles :
  - **Repo Git** (cloner + lancer) — le plus simple ; mise à jour via `git pull`.
  - **App de bureau** (wrapper Electron) — double-clic, embarque tout.
  - **Lanceur** (`npx` / script) — une commande lance le serveur local + ouvre le dashboard.
- **État partagé multi-utilisateurs** : knowledge & templates via le **repo** (git) ; **pipeline**
  via **Notion** (chacun le lit avec son MCP) ; decks générés = locaux à chacun.

> Si un jour tu veux un **vrai SaaS hébergé** (une URL, sans Claude Code local), il faudra
> **l'API Anthropic** (clé facturée à l'org) — seule voie, mais incompatible avec « tokens de
> session de chacun ».
