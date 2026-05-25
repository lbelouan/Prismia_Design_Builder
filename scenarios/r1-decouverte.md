# Scénario RDV1 — DÉCOUVERTE  (`r1-decouverte`)

> **Quand :** rien de précis identifié au cold-call, mais le prospect est intéressé.
> **Angle :** général — notre approche, qui on est, la valeur de l'IA. Léger, pédagogique.
> Ce fichier détaille la **structure du deck** et **oriente l'agent**. Règles & DA communes : `_socle.md`.
>
> Légende — 🔒 **FIXE** (depuis `knowledge/`, ~identique d'un deck à l'autre) ·
> 🎯 **ADAPTÉ** (au contexte de l'entreprise : brief dicté / matching knowledge).

## Structure du deck (≈ 9-10 slides)
| # | Slide (rôle) | Adapt. | Source | Ce qu'on y met |
|---|---|---|---|---|
| 1 | **Cover** | 🎯 | brief | client, accroche large (« Structurer l'IA, étape par étape, chez [client] »), méta (préparé pour / par, date, secteur) |
| 2 | **Contexte & maturité IA** | 🎯 | brief | où en est le prospect ; 3 barres de maturité (`data-width`) par domaine (production / commercial / admin…) |
| 3 | **Le constat** | 🎯 | brief | pourquoi l'IA maintenant ; sans cadre, la valeur se disperse — 3 cartes (aujourd'hui / risque / cible), formulées au général |
| 4 | **Notre approche · 3 territoires IA** (tabs) | 🎯 | `offers.md` (§ Catalogue par domaine) | balayage **large** des leviers du domaine du secteur — pas un seul cas |
| 5 | **Études de cas** | 🎯 | `case-studies.md` | 2-3 cas **variés** (montrer l'étendue) ; hero = cas du secteur si dispo. **Clients signés uniquement** |
| 6 | **Différenciateur** | 🔒 | `company.md` (§ Différenciateur) | qualité de la donnée terrain + plateforme propriétaire + souveraineté |
| 7 | **Méthodologie** | 🔒 | `methodology.md` (§ Le diagnostic en 3 phases) | comment on travaille (rassurer sur le « comment ») |
| 8 | **Prismia** | 🔒 | `company.md` | 4 compteurs FIXES (`3` / `~60` / `~150` / `3000`) + 3 cartes (plateforme, modèle aligné, IP client) |
| 9 | **Prochaines étapes · atelier de découverte** | 🎯 | brief | cadrage léger / atelier pour identifier ensemble les pistes — **pas un devis d'audit** |
| 10 | **Closing** | 🔒 | `company.md` (§ Identité) | contact / signature |

## Composition flexible
Slide 4 (territoires) = **1 slide** (balayage). Pas d'adoption détaillée. Total ≈ 9-10 slides.

## Gate (brief requis)
Secteur + maturité IA **suffisent**. Un cas d'usage précis n'est **pas** exigé. Si « pistes » manque,
le next-step reste l'atelier de découverte → **ne pas bloquer** la génération.

## DA & rendu (figé — voir `_socle.md`)
DA Prismia : **boule 3D CSS** (jamais WebGL/prisme) + violet/aubergine + verre. Clone-and-compose
depuis `templates/r1-premier-rdv.html` ; `<style>` / `<script>` **jamais** modifiés ; compteurs Prismia déjà câblés.
