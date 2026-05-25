# Encapsulation RDV1 — socle commun (knowledge → slides)

> Ce fichier décrit **comment encapsuler la knowledge base en slides** pour un deck de premier
> rendez-vous. La knowledge (`knowledge/*.md`) ne contient **que de l'information** : toute la
> logique de génération (quel contenu va dans quelle slide, sous quel angle) vit **ici** et dans
> les 3 fichiers scénario (`r1-decouverte.md`, `r1-carto.md`, `r1-pilote.md`), qui reprennent ce
> socle et précisent l'angle.

## Principe : socle + bloc flexible (nombre de slides variable)
Le deck se **compose** (clone-and-compose) ; il n'est **pas figé à 11 slides**. La boule se
positionne dynamiquement, `nav-total` se calcule seul.
- **Socle** (toujours présent) : cover · études de cas · différenciateur · méthodologie · Prismia · closing.
- **Slides d'angle** (présentes, ré-anglées par scénario, depuis le brief) : contexte · diagnostic · prochaines étapes.
- **Bloc flexible** (nombre **variable**, piloté par l'audio) : territoires / use-cases (1 → plusieurs slides) · adoption (selon scénario).

## Mapping slide → source (encapsulation)
| Slide | Ce qu'on met | Source |
|---|---|---|
| cover | client, accroche, méta (préparé pour / par / date / secteur) | brief |
| contexte | maturité IA + constat (barres `data-width`) | brief |
| diagnostic | le constat à partager (3 cartes aujourd'hui / risque / cible) | brief |
| territoires / use-cases | leviers IA par domaine | brief + `knowledge/offers.md` (§ Catalogue par domaine + § Cas d'usage par solution) |
| études de cas | cas signés matchés (hero + tuiles + chips) | `knowledge/case-studies.md` |
| différenciateur | notre différenciateur + chips | `knowledge/company.md` (§ Différenciateur) |
| méthodologie | les 3 phases du diagnostic | `knowledge/methodology.md` (§ Le diagnostic en 3 phases) |
| adoption | embarquer les équipes / champions | `knowledge/methodology.md` (§ Adoption) + brief |
| Prismia | qui on est + 4 compteurs + 3 cartes | `knowledge/company.md` (§ Chiffres d'accompagnement + § Identité / Différenciateur) |
| prochaines étapes | next step selon scénario | brief (+ `knowledge/pricing.md` pour le carto) |
| closing | contact / signature | `knowledge/company.md` (§ Identité, § À confirmer = contact) |

## Matching des cas (slide études de cas)
- Piocher dans `knowledge/case-studies.md` les cas **du même `secteur` / `cas-usage`** que le prospect.
- Mettre le cas le plus proche dans la tuile `.hero` ; les autres en tuiles + chips clients.
- **Uniquement des clients signés** — **jamais un prospect en preuve** (cf. `WORKFLOW.md` §B).

## Éléments FIXES (jamais personnalisés par client)
- **4 compteurs Prismia** (depuis `knowledge/company.md` § Chiffres d'accompagnement), **imposés
  tels quels** sur la slide Prismia, indépendamment des autres KPIs : `3` années · `~60` ETI ·
  `~150` projets · `3000` experts. **Déjà câblés dans le template** — ne réécrire que les 3 cartes en dessous.
- **Décor 3D = la boule CSS animée** (positionnement dynamique par slide, recolorée par le tweak
  « Couleurs »). Jamais de WebGL / prisme. Ne jamais réécrire ce moteur (clone-and-compose = slides seulement).

## Règle d'or de ton (toutes slides)
Parler **ROI métier, pas techno** (cf. `knowledge/company.md` § Philosophie & positionnement) :
combien ça coûte, combien ça rapporte, en combien de temps, qui doit s'impliquer.

## Ce qui ne bouge jamais (figé dans le template)
`<style>`, `<script>`, scène 3D et nav du template `templates/r1-premier-rdv.html`. On ne compose
que le bloc `<div class="slides">`.
