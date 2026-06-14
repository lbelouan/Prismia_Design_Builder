---
name: prismia-deck
description: >-
  Génère une présentation HTML de rendez-vous client pour Prismia (conseil IA), fidèle à la DA
  du deck de référence (violet/aubergine, glassmorphism, 3D irisée) et exportable en PDF. Couvre
  deux familles : le PREMIER RENDEZ-VOUS (scénarios `r1-*` : découverte / pilote / carto, à
  socle fixe) ET les RENDEZ-VOUS DE SUIVI R2 / R3 / + (scénario `suivi-libre`, à composition
  libre : nombre de slides et contenu adaptés au contexte). Déclencher quand l'utilisateur décrit
  une situation client en vue d'un RDV — par ex. « prépare une présentation pour [client] »,
  « j'ai un premier rendez-vous avec [entreprise] dans [secteur] », « génère le deck RDV1
  pour... », « prépare le R2 / le point d'avancement / la restitution chez [client] », ou quand
  il dicte/colle un brief client (contexte, enjeux, maturité IA, suite d'un RDV précédent) à
  transformer en présentation. Ne PAS déclencher pour la mémoire client / CRM (hors périmètre).
---

# prismia-deck — Orchestrateur de présentations RDV1

Génère une présentation HTML de **premier rendez-vous** à partir d'un brief client, en
combinant la connaissance pérenne de Prismia (`knowledge/`) et la direction artistique
(`design/`). **Critère directeur : la rapidité de delivery du HTML.**

## Référence de design & template
- **Template de production** (à cloner) : `templates/r1-premier-rdv.html` — mono-fichier
  auto-contenu (CSS + JS inline, Three.js en CDN, **sans** le panneau Tweaks). Contenu
  actuel = exemple Aledia, à réécrire par brief.
- **Deck de référence** (source, runnable) : `design/_handoff-source/project/Prismia x Aledia.html`.
- **DA** : `design/DESIGN.md` + `design/design-system.md`. **Reproduire exactement ce design.**

## Mode de génération retenu : clone-and-compose (mono-fichier)
On **ne découpe pas** en fragments. Pour chaque brief : copier `templates/r1-premier-rdv.html`
vers `clients/<slug>/<slug>-<type>.html` (1 dossier par entreprise, à côté du brief), garder
**figés** le `<style>`, les `<script>` et le décor (scene
3D + nav), puis **composer le bloc `<div class="slides">`** : assembler les `<section
class="slide">` du **socle** (toujours présentes) + un **bloc de contenu flexible** (nombre
**variable**, selon l'audio et ce que Timeo veut aborder au RDV). On réécrit les textes, la méta
cover, les barres `data-width`, compteurs `data-target`, tabs et tuiles de cas.

> **Nombre de slides VARIABLE** (plus figé à 11). La boule se **positionne dynamiquement** pour
> tout nombre de slides et `nav-total` se **calcule automatiquement** : on peut donc ajouter /
> retirer des slides de contenu sans rien recâbler. Toujours conserver les **slides du socle**
> (cf. `scenarios/`). Le `<style>` et les `<script>` ne sont **jamais** modifiés.

## Règles de travail (rappel — voir `CLAUDE.md`)
1. Vérifier l'existant avant de créer ; ne jamais reconstruire de zéro.
2. N'écrire dans `knowledge/` qu'**après accord** explicite (proposer, montrer, attendre).
3. Utiliser le skill **`ui-ux-pro-max`** pour toute décision design / composant / qualité UX.
4. Pas de MCP. Animations / 3D via CDN (Three.js déjà en place ; GSAP/Chart.js au besoin).

## Logique d'orchestration (au déclenchement)

1. **Lire la DA** : `design/design-system.md` + `design/DESIGN.md` (+ le HTML de référence).
2. **Identifier le client et son secteur** depuis le brief.
3. **Lookup base de connaissance** — chercher l'entreprise (par nom, ex. `grep -ri`) dans
   `knowledge/case-studies.md` (clients **signés**) **et** `knowledge/prospects/*.md` (prospects vus) :
   - **Connue** (signée ou fiche prospect existante) → **charger sa fiche** et **compléter le
     brief avec ce qui est déjà au dossier** (ne pas redemander l'acquis).
   - **Nouvelle** → **créer `knowledge/prospects/<slug>.md`** (statut `prospect`) depuis
     `knowledge/prospects/_TEMPLATE.md`, rempli avec les infos du brief.
3bis. **Recherche web sur l'entreprise** (outil `WebSearch` — via la **session**, **pas de clé
   API**) : secteur, taille, actualité, enjeux récents → enrichit le contexte avant la gate.
   Le dashboard peut **pré-remplir** cette recherche (bouton « Enrichir le contexte ») et la
   stocke dans `clients/<slug>/contexte-entreprise.md`, reprise dans le brief sous
   `## Contexte entreprise (recherche — SECONDAIRE)`. **Priorité absolue au transcript et au
   contexte additionnel** : cette section reste *secondaire* et ne doit jamais les surpasser.
   (Connecteurs/API tierces de données société — Apollo, etc. — à évaluer plus tard si besoin.)
4. **Gate de complétude** (cf. section dédiée) — vérifier les infos minimales. S'il en manque,
   **poser des questions ciblées AVANT de générer**, puis **mettre à jour la fiche prospect**
   avec les réponses. Ne jamais générer un deck à trous.
5. **Confronter à la connaissance Prismia** (`company` / `offers` / `methodology`) : utiliser
   l'existant ; toute info **Prismia** nouvelle → la signaler et proposer de l'ajouter — **après accord**.
6. **Matching des cas** : piocher dans `knowledge/case-studies.md` les cas **signés** du même
   secteur / cas d'usage ; cas le plus proche dans la tuile `.hero`. **Jamais un prospect en preuve.**
7. **Générer le HTML** par clone-and-fill : copier `templates/r1-premier-rdv.html` vers
   `clients/<slug>/<slug>-<type>.html` (même dossier que le brief) et composer les slides
   (socle + bloc flexible). Design figé par le template.
8. **Livrer** `clients/<slug>/<slug>-<type>.html` + **mettre à jour la fiche prospect**
   (`knowledge/prospects/<slug>.md` : historique RDV, chemin du deck). Le PDF exporté se range
   dans le même dossier client.

## Gate de complétude — poser des questions AVANT de générer
Avant l'étape 6 (génération), vérifier que le brief couvre les **infos minimales**. Si une
manque ou reste floue, **poser des questions ciblées et groupées** (une seule salve, brève)
et **attendre la réponse** — ne JAMAIS générer un deck à trous ou avec des placeholders.

Infos minimales requises :
1. **Entreprise** (nom) + **secteur d'activité**.
2. **Interlocuteur** : nom + rôle / titre.
3. **Contexte / maturité IA** actuelle (ce qui existe ou non ; ce qui a été dit au 1er contact).
4. **Le constat / l'enjeu principal** à adresser (slide 3).
5. **1 à 3 pistes / cas d'usage** pressentis (slide 4 + matching des cas, slide 5).
6. **Date du RDV** (pour la cover) — **à demander systématiquement** si elle n'est ni dans le
   brief (`rdv_date`) ni mentionnée dans le transcript/contexte.
7. *(utile, non bloquant)* objectif du RDV / prochaine étape, périmètre (nb collaborateurs).

→ Points 1–6 présents : générer. Un seul manquant ou trop vague : **questionner d'abord**.
Astuce : un simple lien LinkedIn ne suffit pas (mur de connexion) — demander les faits directement.

> **Gate adaptée au `type`** (détail des « Brief requis » dans `scenarios/<type>.md`) :
> - **pilote** → le **prototype identifié** (point 5) est **obligatoire et précis** (fonction, douleur, volume) ; sans lui, questionner avant tout.
> - **carto** → exiger le **périmètre** (nb collaborateurs / sites) pour pouvoir chiffrer le diagnostic.
> - **découverte** → le point 5 (pistes) peut rester **général** ; le next-step devient alors un **atelier de découverte** (pas un devis d'audit).

## Encapsulation knowledge → slides : voir `scenarios/` (dossier à la RACINE du projet)
Toute la logique de génération (quel contenu de la knowledge va dans quelle slide, sous quel angle,
par scénario) vit dans des fichiers d'**encapsulation** dédiés. La knowledge (`knowledge/*.md`) ne
contient **que de l'information** — aucune référence aux slides :

- **`scenarios/_socle.md`** — socle commun : principe **socle + bloc flexible** (nombre de slides
  **variable**), **mapping slide → source knowledge**, matching des cas, **éléments FIXES**
  (4 compteurs Prismia, la boule), règle d'or de ton.
- **`scenarios/r1-decouverte.md`** — général sur l'approche (rien d'identifié au call).
- **`scenarios/r1-carto.md`** — le produit (plateforme de diagnostic) + cas d'audit.
- **`scenarios/r1-pilote.md`** — centré sur le prototype identifié (douleur → ROI → pilote).
- **`scenarios/suivi-libre.md`** — **RDV de suivi R2 / R3 / +**, composition **LIBRE** : pas de
  socle imposé, on **adapte le nombre de slides et leur contenu au contexte** (RDV précédents,
  proposition, résultats…). Seuls invariants : la **DA** (template figé, boule, compteurs Prismia
  si slide Prismia) et le garde-fou preuves (clients signés). `_socle.md` n'est lu que pour le
  **contrat de design** (pas pour une trame). Gate orientée suivi (objectif du RDV + matériau).

Au déclenchement : lire le brief `clients/<slug>/<slug>-<type>.md`, ouvrir le fichier du `type` ET
`scenarios/_socle.md` (socle R1 **ou** contrat de design seul pour `suivi-libre`), puis **composer
le deck** (clone-and-compose) en suivant l'encapsulation. Après génération : brief en
`status: généré` + MAJ fiche prospect (historique RDV).

> **Éléments FIXES** (détail dans `_socle.md`) : les 4 compteurs Prismia imposés sur la slide
> Prismia (déjà câblés, ne réécrire que les 3 cartes en dessous) ; décor 3D = la **boule CSS**
> animée (jamais WebGL/prisme) ; `<style>` / `<script>` du template **jamais** modifiés.

## Contraintes de rendu (rappel — voir `CLAUDE.md` / `design-system.md`)
- 1 slide = 1 état final complet (pas de build au clic) ; reveals en cascade au chargement.
- Respect de `prefers-reduced-motion` ; format 16:9 (1920×1080) mis à l'échelle.
- DA-agnostique : aucune couleur/typo en dur, tout via les variables `:root`.
- Nav = pilule unique bas-droite (compteur + prev/next) + clavier.
- **Export PDF** : stratégie à trancher (html2canvas ne rend pas le verre/WebGL — voir
  `design-system.md`). Ne pas figer le bouton tant que ce n'est pas validé.
