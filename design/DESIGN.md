---
version: 1.0
name: Prismia-deck-design
source: Claude Design handoff « r1-prismia » — fichier de référence `Prismia x Aledia.html`
description: >-
  Direction artistique des présentations de premier rendez-vous Prismia : deck 16:9 sombre
  (violet/aubergine profond) à esthétique éditoriale et glassmorphism. Titres en Instrument
  Serif (italique pour les accents), texte en Inter, labels/eyebrows en JetBrains Mono. Une
  forme 3D irisée (TorusKnot WebGL, transmission + iridescence + clearcoat) flotte derrière
  les slides et se repositionne à chaque slide, avec fallback CSS animé. Cartes en verre
  dépoli, spotlight au survol, reveals en cascade au chargement, barres de maturité et
  compteurs animés.

colors:
  bg-0: "#050310"            # fond le plus profond (body)
  bg-1: "#0a0719"            # fond intermédiaire (intérieur glyph, nodes)
  bg-2: "#110b26"            # fond surélevé
  surface: "rgba(28,22,56,0.55)"        # carte verre standard
  surface-strong: "rgba(38,30,72,0.78)" # carte verre survol / dense
  surface-glass: "rgba(255,255,255,0.035)"
  line: "rgba(155,124,255,0.16)"        # filets / bordures fines
  line-bright: "rgba(176,145,255,0.42)" # bordure survol
  text: "#f3effb"            # texte principal
  text-soft: "#b3a8d4"       # texte secondaire
  text-dim: "#7a6f9e"        # texte tertiaire / mono labels
  violet: "#9b7cff"          # marque principale
  violet-bright: "#b89bff"   # accent clair (italiques, eyebrows, highlights)
  violet-deep: "#6a4ee0"     # ombre / dégradés
  violet-soft: "rgba(155,124,255,0.14)"
  violet-line: "rgba(155,124,255,0.4)"
  magenta: "#e07cff"         # accent secondaire (scores faibles, pillars)
  gold: "#ffd28a"            # accent rare

typography:
  display:                   # h1 couverture & closing
    fontFamily: "Instrument Serif, 'Times New Roman', serif"
    fontSize: 156px          # closing réduit à 132px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.03em
  title:                     # h2 de slide
    fontFamily: "Instrument Serif, serif"
    fontSize: 84px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.025em
  serif-lg:                  # noms de cas, titres de cartes serif, num
    fontFamily: "Instrument Serif, serif"
    fontSize: 56px           # terr-detail h3 ; pnum/num 56-60px italique
    fontWeight: 400
  h3:                        # titres de cartes (sans)
    fontFamily: "Inter, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  lead:
    fontFamily: "Inter, sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  eyebrow:                   # sur-titre mono
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 14px
    fontWeight: 400
    textTransform: uppercase
    letterSpacing: 0.2em
  mono-label:                # tags, chapter-tag, footer chrome
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 12px-13px
    letterSpacing: 0.12em-0.2em
    textTransform: uppercase

rounded:
  card: 18px                 # --radius-card (cartes, cases, stats, cta)
  card-sm: 14px              # uc-card, diff-chip, q-item
  node: 50%                  # nodes timeline, dots, glyph
  pill: 999px                # --radius-pill (chips, nav-mini, case-pill)

spacing:
  slide-padding: 88px 120px  # padding standard d'une slide
  cover-padding: 100px 120px 130px
  chrome-inset: 44px         # top/bottom chrome depuis le bord
  grid-gap-lg: 56px          # two-col
  grid-gap-md: 22px          # three-col
  grid-gap-sm: 18px          # four-col / cases
  card-padding: 28px-32px

fonts-cdn:
  google: "Inter:wght@300;400;500;600;700 | Instrument+Serif:ital@0;1 | JetBrains+Mono:wght@400;500"

libraries:
  three: "three@0.160.0 (CDN unpkg) — scène 3D WebGL, fallback CSS si indisponible"
  react-babel: "react/react-dom 18.3.1 + @babel/standalone — UNIQUEMENT pour le panneau Tweaks (outil d'édition, hors deck client)"
---

## Vue d'ensemble

Le deck est une scène **16:9 fixe de 1920×1080** mise à l'échelle pour remplir le viewport
(`--stage-scale` calculé en JS, `Math.min(vw/1920, vh/1080)`). Le fond est un dégradé
radial violet/aubergine très sombre, ponctué d'une **grille fine masquée** en radial, d'un
**bruit** en overlay (`mix-blend-mode: overlay`), de deux **orbes flous** flottants, et
d'une **forme 3D irisée** (`#three-canvas`) qui se repositionne à chaque slide.

L'ambiance : éditoriale et premium, pas « SaaS template ». La voltage de marque vient de la
**typo serif** (Instrument Serif, jamais en gras — l'italique violet porte l'emphase), du
**glassmorphism** (cartes en `backdrop-filter: blur(28px)`), et de la **3D irisée** en
arrière-plan. Tout est calme et superposé ; les animations ne font que révéler au chargement.

## Couleurs

- **Fonds** : `bg-0 #050310` (body), `bg-1 #0a0719`, `bg-2 #110b26`. Le `.stage` ajoute
  par-dessus deux radial-gradients violet/magenta très faibles + un vignettage.
- **Surfaces verre** : `surface rgba(28,22,56,0.55)` au repos, `surface-strong
  rgba(38,30,72,0.78)` au survol/dense. Toujours avec `backdrop-filter: blur(28px) saturate(140%)`.
- **Filets** : `line rgba(155,124,255,0.16)` par défaut → `line-bright rgba(176,145,255,0.42)`
  au survol. Les cartes « actives » utilisent `violet-line rgba(155,124,255,0.4)`.
- **Texte** : `text #f3effb` (principal), `text-soft #b3a8d4` (secondaire/body), `text-dim
  #7a6f9e` (mono labels, captions).
- **Accents** : `violet #9b7cff` (marque), `violet-bright #b89bff` (italiques, eyebrows,
  highlights inline), `violet-deep #6a4ee0` (dégradés/ombres). `magenta #e07cff` signale les
  scores **faibles** (barres de maturité « dim ») et numérote les pillars d'adoption.
  `gold #ffd28a` est rare.

## Typographie

Trois familles, rôles stricts :
- **Instrument Serif** — tous les grands titres (h1 156px, h2 84px), les noms de cas, les
  numéros décoratifs (italique), les valeurs de stats (80px). **Toujours weight 400** ;
  l'emphase passe par l'**italique violet** (`.it`) ou un dégradé clair (`.grad`), jamais le gras.
- **Inter** — texte courant (17px/1.55, couleur `text-soft`), lead (22px), titres de cartes
  sans-serif (h3 600/22px), chips.
- **JetBrains Mono** — eyebrows (14px, uppercase, 0.2em), chapter-tags, tags de cartes,
  scores de maturité, chrome haut/bas, compteur de nav. Toujours uppercase, lettrage large.

## Composants clés

- **`.glass`** — primitive de carte : `surface` + `backdrop-filter: blur(28px) saturate(140%)`
  + bordure `line` + `--radius-card` (18px) + `--shadow-glass`. Survol : bordure `line-bright`,
  `translateY(-3px)`, et un **spotlight radial** (`::before`) qui suit la souris via
  `--mx/--my` (posés en JS). `corner-mark` optionnel (équerre violette au coin TR au survol).
- **`.slide-chrome-top` / `.slide-chrome-bot`** — bandeaux mono en haut/bas (brand-mark +
  chapter-tag en haut ; libellé client + date en bas).
- **`.eyebrow`** — sur-titre mono violet précédé d'un filet dégradé.
- **`h1.display` / `h2.title`** — avec `.it` (italique violet) et `.accent` / `.grad`.
- **`.maturity`** — carte verre + barre (`.track` / `.fill`) animée de 0 → `data-width`%,
  dégradé violet, **shimmer** en boucle. Variante `.fill.dim` (magenta) pour les scores faibles.
- **`.tabs-rail` / `.tab-btn` / `.tab-content`** — onglets mono, soulignement dégradé animé
  (`tabIn`), contenu en `fadeUp` (slide Territoires).
- **`.diag-card`** — carte à dégradé vertical, gros numéro serif italique, tag mono, titre serif.
- **`.case-tile`** (+ `.hero`) — grille d'études de cas 1.4fr/1fr/1fr ; la tuile `.hero`
  s'étend sur 2 lignes avec halo radial. `.case-pill` = badge « live » clignotant.
- **`.timeline` / `.tl-step`** — 3 phases, ligne dégradée, `node` rond serif italique
  (survol : remplissage dégradé + glow).
- **`.pillar`** — cartes d'adoption, gros numéro magenta italique.
- **`.stat`** — valeur serif 80px avec **compteur animé** (`.counter-num data-target`),
  liseré violet en haut.
- **`.q-item`** — paires question (mono `Q.0x`) / description, 2 colonnes.
- **`.cta-card`** — encart conclusif dégradé violet→magenta, titre serif italique.
- **`.nav-mini`** — pilule verre **en bas à droite** : compteur `01 / 11` + boutons prev
  (cercle verre) et next (cercle dégradé violet). C'est le seul sélecteur de page.
- **`.progress-bar`** — fine barre dégradée en haut, largeur = progression.

## Décor & 3D

> **DA — le décor 3D est la BOULE CSS** (`#three-fallback` : blob iridescent morphing +
> anneaux orbitaux + éclat + flottement), repositionnée par slide, **recolorée par le tweak
> Couleurs** (variables CSS). **Choix retenu — aucune dépendance WebGL/Three.js.** Un prisme
> GLB a été exploré puis **écarté** (choix verrouillé sur la boule CSS).

- **Forme 3D WebGL — DÉSACTIVÉE** (`prismia-three.js`) : `THREE.TorusKnotGeometry(1.05,0.34,220,32,2,3)` en
  `MeshPhysicalMaterial` (metalness 0.2, roughness 0.08, transmission 0.85, ior 1.45,
  iridescence 1.0, clearcoat 1.0), environnement procédural pour les reflets, lumières
  key/rim/fill violet→magenta. Un `PRESETS` par slide (position/scale/rotation/opacité) ;
  interpolation `lerp` douce entre slides. Rotation continue lente.
- **Fallback CSS** (`#three-fallback`) si WebGL indisponible : blob morphing
  (conic-gradient irisé) + 3 anneaux orbitaux + shine, repositionné par slide (POS).
- **Orbes** `.orb.a/.b` (blur 60px), **grille** `.stage::before` (88px, masquée radial),
  **bruit** `.noise` (SVG turbulence, blend overlay).

## Mouvement

- **Entrée de slide** : `.slide.active` → opacity + translateY + scale (cubic-bezier
  .4,0,.2,1, ~0.55–0.7s). Chaque `.reveal` enchaîne `revealUp` (blur→net) en **cascade**
  via `nth-child` (delays 0.12s → 0.68s).
- **Barres de maturité** : remises à 0 puis animées à la largeur cible à chaque entrée.
- **Compteurs** : easing cubic-out sur 1400ms, format `fr-FR`.
- **Survols** : cartes `translateY(-3/-4px)` + bordure claire + spotlight ; uc-card glisse
  en X avec balayage lumineux ; tabs soulignement scaleX.
- Respecter `prefers-reduced-motion` (à ajouter : état final immédiat, sans mouvement).

## À faire / Do's & Don'ts

- **Do** : garder Instrument Serif en 400 + italique violet pour l'emphase ; réserver
  `magenta` aux signaux « faible/à structurer » ; une seule forme 3D, repositionnée ;
  cartes verre cohérentes (même blur, même radius 18px).
- **Don't** : pas de gras sur les titres serif ; pas d'emoji (icônes = numéros mono ou SVG) ;
  pas de couleur/typo en dur dans un futur composant — passer par les variables `:root`.

## Note export PDF (à anticiper)

Cette DA repose massivement sur `backdrop-filter` (verre) et un **canvas WebGL** —
**html2canvas ne rend ni l'un ni l'autre fidèlement**. Le mécanisme d'export PDF prévu par
le projet devra être validé sur ce design (voir `design-system.md` → règles de décision).
