# Scénario RDV1 — PILOTE  (`r1-pilote`)

> **Quand :** un **prototype / cas d'usage précis** a déjà été identifié au cold-call.
> **Angle :** centré sur ce prototype — la douleur précise → le use-case → le ROI → le plan.
> Ce fichier détaille la **structure du deck** et **oriente l'agent**. Règles & DA communes : `_socle.md`.
>
> Légende — 🔒 **FIXE** (depuis `knowledge/`, ~identique) · 🎯 **ADAPTÉ** (au contexte : brief / matching).

## Structure du deck (≈ 11-12 slides)
| # | Slide (rôle) | Adapt. | Source | Ce qu'on y met |
|---|---|---|---|---|
| 1 | **Cover** (le cas d'usage précis) | 🎯 | brief | accroche sur le prototype (« [Le prototype] pour [client] : de la douleur au pilote »), méta |
| 2 | **La douleur précise** | 🎯 | brief | le problème **quantifié** (temps perdu, volume, coût) que le prototype résout |
| 3-4 | **Le prototype en détail** | 🎯 | brief + `offers.md` (la solution du domaine) | avant → après, comment ça marche. **Peut prendre 2 slides** selon l'audio |
| 5 | **Cas client le plus proche** | 🎯 | `case-studies.md` (matching par **`cas-usage`**) | le cas signé du **même cas d'usage** en hero — preuve que CE prototype marche |
| 6 | **ROI / impact attendu** | 🎯 | brief + KPI du cas matché | métriques cibles, gain estimé (stat) |
| 7 | **Méthodologie de déploiement** | 🔒 | `methodology.md` (§ Méthodologie de déploiement) | 4 phases : cadrage → base de connaissance → RAG → mise en prod ; **human-in-the-loop** |
| 8 | **Plan de déploiement du pilote** | 🎯 | brief | jalons, ownership métier, KPIs de succès |
| 9 | **Différenciateur** | 🔒 | `company.md` (§ Différenciateur) | mise en production **réelle** (pas de POC poubelle), code & IP côté client |
| 10 | **Prismia** | 🔒 | `company.md` | capacité de delivery (3000 experts) + 4 compteurs FIXES |
| 11 | **Prochaines étapes · cadrage du pilote** | 🎯 | brief | périmètre, quick wins, **ROI estimé**, planning ~4 sem, prérequis (données, accès) |
| 12 | **Closing** | 🔒 | `company.md` (§ Identité) | contact / signature |

## Composition flexible
Le **prototype** (slides 3-4) peut prendre 1 à 2 slides selon le niveau de détail dicté (avant/après,
fonctionnement, schéma). Total ≈ 11-12 slides.

## Gate (brief requis — **obligatoire**)
**Le prototype identifié** : quelle solution / fonction concernée, la **douleur précise**
(volume, temps, coût), la **métrique cible**. Sans lui → **questionner avant de générer**.

## DA & rendu (figé — voir `_socle.md`)
DA Prismia : **boule 3D CSS** (jamais WebGL/prisme) + violet/aubergine + verre. Clone-and-compose
depuis `templates/r1-premier-rdv.html` ; `<style>` / `<script>` **jamais** modifiés ; compteurs Prismia déjà câblés.
