# Prismia — Générateur de présentations HTML (RDV1)

Contexte projet chargé à chaque session. Sert d'orchestrateur de référence pour la
génération de présentations HTML de **premier rendez-vous** client.

---

## CONTEXTE

Prismia est une société de conseil en IA (France / Belgique). On industrialise ici la
production de présentations HTML pour les clients : à partir d'un **brief** (souvent dicté
à l'oral puis transcrit), on génère une présentation HTML soignée, **toujours cohérente avec
la direction artistique (DA)**, et **exportable en PDF**.

- **Périmètre actuel : deux familles de présentations.**
  1. **Premier rendez-vous** — scénarios `r1-*` (découverte / pilote / carto), à **socle de
     slides fixe** (trame ci-dessous).
  2. **Rendez-vous de suivi (R2, R3, +)** — scénario `suivi-libre`, à **composition LIBRE** :
     on **adapte le nombre de slides et leur contenu au contexte** accumulé (RDV précédents,
     proposition, résultats…). **Aucune trame imposée** ; seul invariant = la DA du template R1.
     Détail : `scenarios/suivi-libre.md`.

  La mémoire client / CRM reste hors périmètre.
- **Critère directeur de toutes les décisions : la RAPIDITÉ de delivery du HTML.**

---

## RÈGLES DE TRAVAIL (impératives)

1. **Vérifier l'existant avant de créer.** Si un fichier existe déjà (composant, base de
   connaissance, design system), le récupérer et partir de lui. Ne jamais reconstruire de zéro.
2. **N'écrire dans la connaissance Prismia qu'après accord** (`company` / `offers` /
   `methodology` / `case-studies`) : proposer, montrer, attendre la validation. **Exception :**
   les **fiches prospects** (`knowledge/prospects/`) sont créées / mises à jour
   **automatiquement** par l'orchestrateur. Promouvoir un prospect en cas signé
   (`case-studies.md`) reste soumis à accord.
3. **Utiliser le skill `ui-ux-pro-max`** (dans `.claude/skills/`) pour toute décision de
   design, de composant ou de qualité UX.
4. **Pas de MCP particulier.** Pour les animations et la 3D, utiliser les librairies JS
   pertinentes en CDN (GSAP, Three.js, Spline, Chart.js selon le besoin).
5. **Compléter le brief avant de générer.** Si le brief ne contient pas les infos minimales
   pour personnaliser le deck (entreprise, secteur, interlocuteur + rôle, contexte/maturité,
   constat, pistes/cas d'usage), **poser des questions ciblées AVANT de générer le HTML** —
   ne jamais livrer un deck à trous. Détail : `WORKFLOW.md` § 0 et `prismia-deck` § Gate de complétude.

---

## ARCHITECTURE

```
Projet_templateR1/
├── CLAUDE.md                    # ce fichier — contexte + règles + trame + mécanique
├── WORKFLOW.md                  # process audio → HTML (gate, lookup, fiche prospect)
├── DASHBOARD.md                 # spec cockpit (Notion = source de vérité — NON construit)
├── knowledge/                   # connaissance Prismia — INFO PURE (aucune réf. aux slides)
│   ├── company · offers · methodology · case-studies · pricing (.md)
│   └── prospects/               # 1 .md par entreprise prospect (auto-créé / maj) + _TEMPLATE.md
├── design/                      # direction artistique
│   ├── DESIGN.md                # DA de référence (extraite du handoff Claude Design)
│   ├── design-system.md         # pont DESIGN.md → variables CSS + règles de décision
│   └── _handoff-source/         # bundle Claude Design « r1-prismia » (deck Aledia + assets)
├── templates/
│   └── r1-premier-rdv.html      # TEMPLATE mono-fichier auto-contenu (clone-and-fill)
├── clients/                     # 1 dossier PAR ENTREPRISE : brief .md + deck .html + .pdf + context/
│   └── <slug>/                  #   <slug>-<type>.md (brief) · <slug>-<type>.html (deck) · .pdf · context/
├── tools/                       # outillage local : export-pdf.mjs (screenshots → PDF, puppeteer-core)
├── dashboard/                   # cockpit local (serveur Node + SPA, mode B) — `node dashboard/server.js`
├── scenarios/                   # ENCAPSULATION knowledge → slides (visible, racine) :
│                                #   _socle.md + r1-decouverte/pilote/carto.md + suivi-libre.md (R2+ libre)
└── .claude/skills/              # (caché — convention Claude Code)
    ├── ui-ux-pro-max/           # skill qualité UX/UI (installé v2.5.0)
    └── prismia-deck/SKILL.md    # déclencheur de l'orchestrateur (pointe vers scenarios/)
```

> **Mode de génération retenu : clone-and-compose mono-fichier.** L'orchestrateur copie
> `templates/r1-premier-rdv.html` vers `clients/<slug>/<slug>-<type>.html` (1 dossier par
> entreprise, à côté du brief et du PDF) et **compose les slides** : un
> **socle fixe** (selon le scénario) + un **bloc de contenu flexible** au **nombre variable**
> (piloté par l'audio / ce que Timeo veut aborder). Le `<style>` et les `<script>` restent figés
> (design garanti) ; la boule se positionne dynamiquement et `nav-total` se calcule seul, donc le
> nombre de slides n'est **plus bloqué à 11**. **Encapsulation (mapping + angle par scénario) :
> `scenarios/`** (à la racine) ; la knowledge (`knowledge/*.md`) ne contient que de l'**information**.
>
> **`ui-ux-pro-max`** : installé dans `.claude/skills/ui-ux-pro-max/` (SKILL.md + `scripts/`
> + `data/` + `templates/`), depuis la marketplace `nextlevelbuilder/ui-ux-pro-max-skill`
> (v2.5.0). Les chemins d'invocation du SKILL.md ont été adaptés à ce dossier ; moteur de
> recherche testé (`scripts/search.py`). Alternative gérée : `/plugin marketplace add
> nextlevelbuilder/ui-ux-pro-max-skill` puis `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill`
> (commandes à lancer toi-même dans Claude Code — non exécutables par l'agent).

---

## PORTABILITÉ — dossier autonome

Ce dossier est **autonome** : ouvert dans Claude Code par n'importe quel collaborateur, il
permet de générer des présentations de premier RDV, sans dépendance externe au projet.
- **Tout est embarqué** : DA (`design/`), template auto-contenu (`templates/`), connaissance +
  prospects (`knowledge/`), orchestrateur (`.claude/skills/prismia-deck/`) et skill UX
  (`.claude/skills/ui-ux-pro-max/`).
- **Déclencheur** : décrire une situation client de premier RDV → le skill `prismia-deck`
  s'active et suit le flux : **lookup entreprise → fiche prospect → gate de complétude →
  génération HTML**.
- **Pré-requis machine** : un navigateur moderne ; **Python 3** (scripts du skill
  `ui-ux-pro-max`) ; accès internet pour les polices Google + Three.js CDN (sinon repli typo,
  et la « boule » s'affiche quand même). `poppler` seulement pour **ingérer** de nouveaux PDF sources.
- Les decks générés (`clients/<slug>/<slug>-<type>.html`) sont des **fichiers uniques** livrables tels quels.

---

## TRAME DU PREMIER RDV — socle + bloc flexible (réf. Prismia × Aledia)

Trame de **référence** ci-dessous (ordre canonique). Le deck = un **socle de slides fixes**
(cover, études de cas, différenciateur, méthodologie, Prismia, closing — quasi automatiques
depuis `knowledge/`) + des **slides d'angle** (contexte, diagnostic, prochaines étapes, depuis
le brief) + un **bloc de contenu flexible** au **nombre variable** (territoires / use-cases :
1 à plusieurs slides selon l'audio et ce que Timeo veut aborder). Le **nombre total n'est plus
figé à 11** : la boule se positionne dynamiquement, `nav-total` se calcule seul. Cette séparation
socle / angle / flexible rend la génération **rapide ET adaptable**. Détail (mapping slide →
knowledge + angle par scénario) : **`scenarios/`** (à la racine — `_socle.md` + un fichier par type).

| #  | Slide              | data-label         | Source du contenu                          |
|----|--------------------|--------------------|--------------------------------------------|
| 1  | cover              | Couverture         | brief (client, accroche, méta)             |
| 2  | contexte           | Contexte [client]  | brief (maturité IA, constat) + barres      |
| 3  | diagnostic         | Diagnostic         | brief (le constat à partager)              |
| 4  | territoires (tabs) | Territoires IA     | brief + `knowledge/offers.md`              |
| 5  | études de cas      | Études de cas      | `knowledge/case-studies.md` (matching secteur) |
| 6  | différenciateur    | Différenciateur    | `knowledge/company.md`                     |
| 7  | méthodologie       | Méthodologie       | `knowledge/methodology.md` (3 phases)      |
| 8  | adoption           | Adoption           | `knowledge/methodology.md` + brief         |
| 9  | Prismia            | Prismia            | `knowledge/company.md` (+ stats)           |
| 10 | prochaines étapes  | Prochaines étapes  | brief (questions de cadrage du pilote)     |
| 11 | closing            | Merci              | `knowledge/company.md` (contact)           |

**Socle** (5 études de cas · 6 différenciateur · 7 méthodologie · 9 Prismia · 11 closing, + 1 cover)
→ quasi automatiques depuis `knowledge/`. **Angle** (2 contexte · 3 diagnostic · 10 prochaines étapes)
→ depuis le brief. **Bloc flexible** (4 territoires / use-cases · 8 adoption) → nombre **variable**
selon l'audio. Les numéros = ordre indicatif, pas une limite.

> **Éléments FIXES (ne jamais personnaliser)** — voir `knowledge/company.md` § slide 9 :
> - **Slide 9 : 4 compteurs imposés** → `3` Années d'accompagnement IA · `~60` ETI
>   accompagnées · `~150` Projets menés · `3000` Développeurs & experts data/ML mobilisables.
>   (Déjà câblés dans le template ; ne PAS substituer par les KPIs BDR.)
> - **Décor 3D = la boule CSS animée** (choix retenu) — pas de prisme/WebGL.

---

## RÈGLES DE CONCEPTION DES SLIDES (impératives)

1. **Une slide = un état final unique et complet.** Pas de build au clic ; toutes les
   `.reveal` s'animent en cascade **au chargement** (≤ ~0,8 s) puis l'état est figé.
2. **Format 16:9** : scène fixe 1920×1080 mise à l'échelle (`--stage-scale` posé en JS).
3. **Respecter `prefers-reduced-motion`** (état final immédiat — à ajouter au deck).
4. **Navigation** = une seule pilule `.nav-mini` **en bas à droite** (compteur + prev/next)
   + clavier (← → espace PageUp/Down Home/End). Pas de dock par slide.
5. **Icônes en SVG ou numéros mono, jamais d'emoji.**
6. **Aucun tiret long dans le texte des slides.** Jamais de tiret cadratin `—` ni demi-cadratin
   `–` (ça « fait IA ») — utiliser virgule, deux-points, parenthèse ou deux phrases. Le trait
   d'union `-` (mots composés) reste OK. S'applique à tout le contenu réécrit, **y compris la
   méta cover**. Le template de référence en contient : les supprimer en réécrivant.
7. **3D / décor** : une **boule CSS animée** (`#three-fallback` : blob iridescent morphing +
   anneaux orbitaux + éclat + flottement), repositionnée par slide, **recolorée par le tweak
   Couleurs** (variables CSS). **Aucune dépendance WebGL/Three.js.** (Une variante **prisme
   GLB** a été testée puis **écartée** — choix verrouillé sur la boule.)
   Décor uniquement — ne doit jamais masquer le contenu.

---

## EXPORT PDF — contrainte à arbitrer

La DA repose sur `backdrop-filter` (verre) et un **canvas WebGL** : **html2canvas ne les
rend pas fidèlement**. La stratégie d'export (impression navigateur / headless / html2canvas
dégradé) reste à trancher — voir `design/design-system.md`. Ne pas figer le bouton tant que
ce n'est pas validé. Objectif inchangé : générer le PDF en interne, livrer le PDF au client.

---

## DESIGN SYSTEM (DA)

- La DA de référence vit dans `design/DESIGN.md` (extraite du handoff Claude Design
  « r1-prismia »). Le deck de référence runnable : `design/_handoff-source/project/Prismia x Aledia.html`.
- **Ne coder aucune couleur / typo en dur.** Tout passe par les variables `:root`
  (`--bg-*`, `--surface`, `--violet*`, `--text*`, `--radius-*`…) documentées dans
  `design/design-system.md`.
- **Tweaks (intégrés au template)** : 2 réglages légers cliquables (bouton « Aa », bas-gauche)
  — **Typographie** (7 : Éditorial, Fraunces, Playfair, Cormorant, Grotesk, Syne, Bricolage)
  et **Couleurs** (8 : Violet, Cobalt, Émeraude, Crimson, Ambre, Magenta, Cyan, Mono), en
  vanilla JS, persistés et masqués à l'impression. Le gros panneau React/Babel du handoff
  reste exclu (trop lourd / outil d'édition).
