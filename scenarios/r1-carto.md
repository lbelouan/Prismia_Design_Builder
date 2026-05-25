# Scénario RDV1 — CARTOGRAPHIE  (`r1-carto`)

> **Quand :** la **cartographie / l'audit** a été identifié comme intéressant au cold-call.
> **Angle :** centré sur **le diagnostic comme produit** (la plateforme) + les **cas d'audit**.
> Ce fichier détaille la **structure du deck** et **oriente l'agent**. Règles & DA communes : `_socle.md`.
>
> Légende — 🔒 **FIXE** (depuis `knowledge/`, ~identique) · 🎯 **ADAPTÉ** (au contexte : brief / matching).

## Structure du deck (≈ 11 slides)
| # | Slide (rôle) | Adapt. | Source | Ce qu'on y met |
|---|---|---|---|---|
| 1 | **Cover** (le diagnostic) | 🎯 | brief | « Cartographier où l'IA crée de la valeur chez [client] », méta |
| 2 | **Contexte** | 🎯 | brief | « beaucoup d'initiatives / de process, peu de **visibilité priorisée** » + barres de maturité |
| 3 | **Le constat** | 🎯 | brief | sans cartographie, on déploie au feeling → **POC à la poubelle** (3 cartes aujourd'hui / risque / cible) |
| 4 | **La plateforme de cartographie** (LE produit) | 🔒 | `company.md` (§ Différenciateur) | la plateforme propriétaire + la qualité de la donnée terrain, **mise en avant** |
| 5 | **La méthodologie du diagnostic** | 🔒 | `methodology.md` (§ Le diagnostic en 3 phases) | **EN VEDETTE** : 3 phases (~4 sem), Agent IA d'entretien (~90% auto), portail d'audit (timeline) |
| 6 | **Ce que la carto va révéler chez eux** | 🎯 | brief + `offers.md` (§ Catalogue) | les domaines / fonctions **à auditer chez ce client** |
| 7 | **Études de cas d'AUDIT** | 🎯 | `case-studies.md` (filtre `cas-usage` = audit / roadmap) | ALMA (x6), DENIS (+21%), SEDI-ATI (+16%), RECMA (+15%), OVB (+16%), Di-Costanzo (+11%) ; clients signés |
| 8 | **Adoption** | 🔒 | `methodology.md` (§ Adoption) | « tout le monde interviewé » — la carto embarque les équipes (champions internes) |
| 9 | **Prismia** | 🔒 | `company.md` | 4 compteurs FIXES + plateforme propriétaire |
| 10 | **Prochaines étapes · LE diagnostic** | 🎯 | brief + `pricing.md` (§ Diagnostic — grille) | périmètre (nb collab.), ~4 sem, **grille de prix chiffrée**, livrables = cartographie + roadmap impact/effort |
| 11 | **Closing** | 🔒 | `company.md` (§ Identité) | contact / signature |

## Composition flexible
Slide 6 (domaines à auditer) = 1 slide, **2 si plusieurs fonctions** sont visées. Total ≈ 11 slides.

## Gate (brief requis)
Les **fonctions / processus** à éclairer + le **périmètre** (nb collaborateurs / sites) — nécessaire
pour chiffrer via `pricing.md`. Si le périmètre manque → **le demander avant de générer**.

## DA & rendu (figé — voir `_socle.md`)
DA Prismia : **boule 3D CSS** (jamais WebGL/prisme) + violet/aubergine + verre. Clone-and-compose
depuis `templates/r1-premier-rdv.html` ; `<style>` / `<script>` **jamais** modifiés ; compteurs Prismia déjà câblés.
