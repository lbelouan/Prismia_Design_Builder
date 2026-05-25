# Design System — pont DESIGN.md → template

Mappe les tokens de `design/DESIGN.md` (DA Prismia, issue du handoff Claude Design) vers les
variables CSS du template, et porte les **règles de décision non-visuelles**.

## Contrat de variables CSS (réel — `:root` du deck de référence)

Défini à un seul endroit (`_base.html` / `prismia-styles.css`), consommé par tous les blocs.
**Aucune couleur / typo en dur dans les fragments** — tout passe par ces variables.

| Variable            | Valeur                        | Rôle |
|---------------------|-------------------------------|------|
| `--bg-0`            | `#050310`                     | Fond body le plus profond |
| `--bg-1`            | `#0a0719`                     | Fond intermédiaire (nodes, intérieur glyph) |
| `--bg-2`            | `#110b26`                     | Fond surélevé |
| `--surface`         | `rgba(28,22,56,0.55)`         | Carte verre au repos |
| `--surface-strong`  | `rgba(38,30,72,0.78)`         | Carte verre survol / dense |
| `--surface-glass`   | `rgba(255,255,255,0.035)`     | Voile clair |
| `--line`            | `rgba(155,124,255,0.16)`      | Filets / bordures fines |
| `--line-bright`     | `rgba(176,145,255,0.42)`      | Bordure survol |
| `--text`            | `#f3effb`                     | Texte principal |
| `--text-soft`       | `#b3a8d4`                     | Texte secondaire (body) |
| `--text-dim`        | `#7a6f9e`                     | Texte tertiaire / mono labels |
| `--violet`          | `#9b7cff`                     | Couleur de marque |
| `--violet-bright`   | `#b89bff`                     | Accent clair (italiques, eyebrows) |
| `--violet-deep`     | `#6a4ee0`                     | Dégradés / ombres |
| `--violet-soft`     | `rgba(155,124,255,0.14)`      | Remplissage doux |
| `--violet-line`     | `rgba(155,124,255,0.4)`       | Bordure active |
| `--magenta`         | `#e07cff`                     | Accent secondaire (signaux « faible ») |
| `--gold`            | `#ffd28a`                     | Accent rare |
| `--radius-card`     | `18px`                        | Rayon des cartes |
| `--radius-pill`     | `999px`                       | Rayon pilule (chips, nav) |
| `--shadow-glass`    | `0 30px 80px -30px rgba(124,88,255,0.45), inset 0 1px 0 rgba(255,255,255,0.06)` | Ombre verre |
| `--stage-scale`     | calc. JS                      | Échelle de la scène 16:9 (posée par `prismia-deck.js`) |

Polices (familles inline, chargées via Google Fonts) :
`Instrument Serif` (titres/serif, italique pour l'emphase) · `Inter` (texte/UI) ·
`JetBrains Mono` (eyebrows, tags, chrome). Voir `DESIGN.md` pour les tailles/rôles.

## Règles de décision (non visuelles)

- **Mécanique des slides** : une slide = un état final unique et complet (pas de build au
  clic). Toutes les `.reveal` s'animent en cascade **au chargement** (≤ ~0.8 s) puis l'état
  est figé. Respecter `prefers-reduced-motion` (état final immédiat — **à ajouter au deck**).
- **Format** : scène fixe **1920×1080 (16:9)**, mise à l'échelle par `--stage-scale`.
- **Navigation** : un seul sélecteur, la pilule **`.nav-mini` en bas à droite** (compteur +
  prev/next) ; clavier ← → espace PageUp/Down Home/End. Pas de dock par slide.
- **Icônes** : SVG ou numéros mono — **jamais d'emoji**.
- **3D / décor** : une **boule CSS animée** (`#three-fallback` : blob iridescent + anneaux
  orbitaux + flottement), repositionnée par slide, **recolorée via les variables CSS** (tweak
  Couleurs). **Pas de WebGL/Three.js** (le prisme GLB a été testé puis **écarté** — choix
  verrouillé sur la boule). Décor uniquement — ne doit jamais masquer le contenu.
- **Tweaks (intégrés, légers)** : 2 réglages **cliquables** en vanilla JS via le bouton
  « Aa » (bas-gauche), panneau scrollable — **Typographie** (7 : Éditorial, Fraunces, Playfair,
  Cormorant, Grotesk, Syne, Bricolage) et **Couleurs** (8 : Violet, Cobalt, Émeraude, Crimson,
  Ambre, Magenta, Cyan, Mono). Pilotent les variables `:root` (`--font-display/-ui`, accents
  `--violet*`/`--magenta` + la boule), persistés (localStorage), masqués à l'impression.
  Le panneau React/Babel lourd du handoff reste, lui, exclu.

## ⚠️ Export PDF — contrainte technique à arbitrer

La DA repose sur `backdrop-filter` (glassmorphism) et un **canvas WebGL**. **html2canvas ne
capture fidèlement ni le flou de verre ni le WebGL.** Le mécanisme « html2canvas → jsPDF »
prévu par le projet produira un rendu dégradé sur ce design. Pistes à valider avec Timeo :
- **A.** Impression navigateur → PDF (`@media print` paysage, 1 slide/page) — meilleur rendu
  du verre via le moteur de rendu natif ; perd le WebGL (remplacé par le fallback/un still).
- **B.** Capture par navigateur headless (Playwright/Chrome) — fidélité maximale, mais
  dépendance hors « tout-CDN ».
- **C.** html2canvas en acceptant la perte du verre/3D (le plus simple, le moins fidèle).

> Tant que ce point n'est pas tranché, ne pas figer le bouton d'export sur ce design.

## Trame réelle (deck de référence) — 11 slides

cover · contexte (« ce qu'on a retenu ») · diagnostic (le constat) · territoires IA (tabs) ·
études de cas · différenciateur · méthodologie (3 phases) · adoption · Prismia (partenaire) ·
prochaines étapes (questions) · closing. Détail des sources (mapping + angle par scénario) dans `scenarios/` (racine).

## TODO
- [x] Brancher le `DESIGN.md` Prismia (handoff Claude Design « r1-prismia »).
- [x] Figer le mapping tokens → variables CSS (ci-dessus).
- [ ] Trancher la stratégie d'export PDF (A / B / C).
- [ ] Décider de la granularité des composants (_base + 11 fragments).
