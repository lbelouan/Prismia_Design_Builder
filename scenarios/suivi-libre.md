# Scénario SUIVI — LIBRE  (`suivi-libre`)

> **Quand :** tout rendez-vous **après le premier** — R2, R3, restitution, point d'avancement,
> présentation de proposition, négociation… Bref, dès qu'il y a **du contexte accumulé** (RDV
> précédents, notes, proposition, échanges) à transformer en deck.
> **Angle :** **aucune trame imposée.** Tu **adaptes le nombre de slides ET leur contenu** au
> contexte fourni. Le seul invariant est la **direction artistique** : même template, même DA,
> même boule. Règles & DA communes : `_socle.md` (lu UNIQUEMENT pour le contrat de design).
>
> Différence clé avec les scénarios `r1-*` : ceux-ci ont un **socle de slides fixe**. Ici **non** —
> on compose librement, piloté par le contexte. Les seules slides « réflexes » sont la **cover**
> (au début) et le **closing** (à la fin), pour le cadrage visuel et le contact.

---

## Principe : composition 100 % pilotée par le contexte

1. **Lis TOUT le contexte avant de composer.** Pour un RDV de suivi, le contexte prime sur toute
   trame : `clients/<slug>/<slug>-suivi-libre.md` (le brief), la **fiche prospect**
   `knowledge/prospects/<slug>.md` (historique RDV, pistes, constats déjà posés), les **fichiers
   joints** dans `clients/<slug>/context/` (deck R1, proposition, notes…), et la knowledge
   Prismia à piocher au besoin.
2. **Déduis la narration du contexte**, pas d'un gabarit. Demande-toi : *où en est-on, quel est
   l'objectif de CE rendez-vous, qu'est-ce que l'interlocuteur attend de cette session ?* La
   réponse dicte les slides à produire et leur ordre.
3. **Nombre de slides VARIABLE et assumé.** Le template gère n'importe quel nombre de slides : la
   boule se positionne dynamiquement et `nav-total` se calcule seul. Mets le nombre de slides que
   le sujet mérite — ni padding, ni compression artificielle.
4. **Une slide = une idée, état final unique** (reveals en cascade au chargement). Comme partout.

> Pas de minimum/maximum dogmatique. Un point d'avancement court peut faire 5-6 slides ; une
> restitution de diagnostic ou une proposition détaillée peut en faire 15+. C'est le contexte qui tranche.

---

## Briques de récit fréquentes en suivi (à piocher, **non imposées**)

Inspiration seulement — choisis, combine, réordonne selon le contexte :
- **Rappel / où on en est** — ce qui a été dit/décidé au(x) RDV précédent(s).
- **Ce qui a avancé depuis** — livrables, premiers résultats, quick wins, données collectées.
- **Restitution / résultats** — chiffres, cartographie, findings du diagnostic.
- **La proposition** — périmètre, plan, jalons, ownership, chiffrage (cf. `knowledge/pricing.md`).
- **ROI / impact attendu** — métriques cibles, gains estimés.
- **Réponses aux objections / points en suspens** soulevés au RDV précédent.
- **Cas clients** — preuve par les pairs (**signés uniquement**, cf. garde-fou).
- **Méthodologie / différenciateur / Prismia** — si pertinents pour CE rendez-vous (souvent
  déjà vus en R1 → ne les remets que s'ils servent l'objectif du jour).
- **Prochaines étapes / décision attendue** — l'action concrète que ce RDV doit déclencher.

---

## Palette de composants (réutilise le HTML/CSS EXISTANT — n'invente aucune CSS)

Compose les `<section class="slide">` en **réutilisant les classes déjà définies** dans
`templates/r1-premier-rdv.html`. Copie-colle un bloc existant du template et réécris son texte.
**Aucune nouvelle règle CSS, aucun style en dur** — tout vit déjà dans le `<style>` figé.

**Slides « cover » (début & fin)** — `<section class="slide cover">` :
- `.cover-eyebrow-big` (filet + label + `brand-mark`) · `h1.display` (avec `.grad` / `.it` / `.accent`) · `.cover-meta` (paires `.label` / `.value`).

**Chrome d'une slide de contenu** — `<section class="slide">` :
- `.slide-chrome-top` (`brand-mark` + `chapter-tag` avec `.dot`) · `.slide-chrome-bot` (2 spans : label client · date).
- En-têtes : `.reveal .eyebrow` (sur-titre) · `h2.reveal.title` (titre, accents `.it` / `.accent`) · `p.reveal.lead` (chapô) · `.reveal .pull` (citation/pull-quote).

**Mises en page** : `.two-col` · `.three-col` · `.four-col`.

**Composants** :
- `.checklist` (`<ul>` à puces cochées).
- **Barres de maturité/progression** : `.maturity` › `.maturity-head` (`h3` + `.maturity-score`) + `.track` › `.fill[.dim]` avec `data-width="NN"` + `.desc`.
- **Cartes constat / atouts** : `.diag-card` (`.num` optionnel · `.tag` « → … » · `h3` · `p`) — souvent dans `.three-col`.
- **Tabs / territoires** : `.tabs-rail` + `.tab-btn[data-tab="tX"]` ↔ `.tab-content#tX` › `.terr-grid` (`.terr-detail` : `.sub`/`h3`/`p`/`.checklist` + `.uc-stack` › `.uc-card` › `.ut`(`.arrow`)/`.ud`).
- **Études de cas** : `.cases-grid` › `.case-tile`(`.hero` pour le cas phare) (`.case-pill` · `.case-meta` : `.case-name`/`.case-sector` · `.case-desc`) puis `.clients-row` › `.client-chip`(`.dot` + `.sect`).
- **Chips différenciateur** : `.diff-grid` › `.diff-chip` (`.icon` = numéro).
- **Encart d'accroche** : `.cta-card` (`h3` + `p`).
- **Timeline / phases** : `.timeline` › `.tl-step` (`.node` = n° · `.phase` · `h3` · `<ul>`).
- **Piliers** : `.four-col` › `.pillar` (`.pnum` · `h3` · `p`).
- **Compteurs / stats** : `.four-col` › `.stat` (`.value` › `.counter-num[data-target="N"]` · `.label`).
- **Questions** : `.q-grid` › `.q-item` (`.q-num` « → Q.0X » + `.q-t`/`.q-d`).
- Utilitaires de texte : `.mono`, `.text-soft`, `.it`, `.accent`, `.grad`.

---

## Éléments VERROUILLÉS (jamais touchés — cf. `_socle.md`)

- **Clone-and-compose mono-fichier** : copier `templates/r1-premier-rdv.html` vers
  `clients/<slug>/<slug>-suivi-libre.html` et **ne composer que** le bloc `<div class="slides">`.
- **`<style>` et `<script>` JAMAIS modifiés** → design, animations, reveals, nav et 3D garantis.
- **Décor 3D = la boule CSS animée** (jamais WebGL/prisme), repositionnée seule par slide.
- **Nav** = pilule unique bas-droite + clavier (déjà câblée) ; `nav-total` auto.
- **Si** tu inclus une slide **Prismia**, ses **4 compteurs restent FIXES** : `3` années · `~60`
  ETI · `~150` projets · `3000` experts (ne réécrire que les 3 cartes en dessous). La slide
  Prismia elle-même est **optionnelle** en suivi.
- **Cover & closing** : reporter l'interlocuteur (nom + poste) sur « Préparé pour » et la **date
  du RDV** ; closing = contact Prismia (`knowledge/company.md`).

---

## Garde-fou preuves (inchangé)

En slide « cas / preuve », **uniquement des CLIENTS SIGNÉS** de `knowledge/case-studies.md`
(matching secteur / cas d'usage). **Jamais un prospect en preuve** (cf. `WORKFLOW.md` §B).

---

## Gate de complétude — version SUIVI

En suivi, on a généralement beaucoup de matière ; la gate vérifie surtout qu'on **sait quoi
présenter et pourquoi**. Avant de générer, s'assurer d'avoir :
1. **Où on en est** — quel(s) RDV précédent(s), ce qui y a été dit/décidé, ce qui a avancé depuis.
2. **L'objectif de CE rendez-vous** — qu'est-ce que cette session doit accomplir / décider.
3. **Le matériau à présenter** — résultats, proposition, chiffrage, points à traiter (ce que
   Timeo veut aborder).
4. **Date du RDV** + **interlocuteur** (nom + rôle) pour la cover — demander si absents.

→ Si l'objectif du RDV **ou** le matériau à présenter manque (deck creux impossible à composer),
**poser UNE salve de questions ciblées et s'arrêter** avant de générer. Sinon, composer librement.

## DA & rendu (figé — voir `_socle.md`)
DA Prismia : **boule 3D CSS** (jamais WebGL/prisme) + violet/aubergine + verre. Clone-and-compose
depuis `templates/r1-premier-rdv.html` ; `<style>` / `<script>` **jamais** modifiés ; compteurs Prismia déjà câblés.
