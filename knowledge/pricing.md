# Pricing — Prismia

> Modèle tarifaire connu (extrait de `offers.md` / `company.md` / docs sources). Les **montants
> réels (€/TJM)** sont en placeholder — à compléter après validation (règle #2).

## Modèle économique
- **Forfait fixe sur le diagnostic** + **marge indexée sur les KPI** réellement atteints en
  déploiement (alignement des intérêts).
- **3 flux de revenus** :
  - **Conseil / Audit** — facturé au projet (phase de diagnostic).
  - **Projet / Build** — au projet ou en régie (développement & intégration).
  - **Retainer long terme** — contrat récurrent (veille, formation, maintenance, évolutions).

## Diagnostic (cadrage) — grille tarifaire
- **Base fixe : 2 000 €.**
- **+ 300 € / collaborateur** pour les **50 premiers** collaborateurs.
- **Dégressivité par palier : −20 % sur le coût par collaborateur à chaque doublement de
  l'effectif** (les collaborateurs supplémentaires au-delà d'un palier passent au tarif réduit).

| Palier (effectif) | Coût / collaborateur |
|---|---|
| 1 – 50            | 300 €                |
| 51 – 100          | 240 € (−20 %)        |
| 101 – 200         | 192 €                |
| 201 – 400         | 153,60 €             |
| 401 – 800         | 122,88 €             |

**Exemples** (base 2 000 € incluse) :
- **30 collab.** → 2 000 + 30×300 = **11 000 €**
- **80 collab.** → 2 000 + 50×300 + 30×240 = **24 200 €**
- **150 collab.** → 2 000 + 50×300 + 50×240 + 50×192 = **38 600 €**

## Déploiement / implémentation
- Modèle : `[forfait + indexation KPI — détailler la part fixe / variable, à compléter]`.
- Régie / TJM (si applicable) : `[à compléter]`.

## Hébergement & conformité (impact tarifaire)
- **Option A** — sur l'infra existante du client (Cloud / bare metal).
- **Option B** — serveurs Prismia souverains (EU, RGPD, ISO 27001, SOC2). Niveau de sécurité
  **adapté au budget et au secteur** (santé, assurance, finance) → impact sur le tarif.

## À compléter
- [x] Grille diagnostic : **2 000 € + 300 €/collab (50 premiers), −20 %/palier au doublement** (2026-05-25).
- [ ] Grille déploiement (forfait + part KPI), TJM régie.
- [ ] Conditions des retainers (paliers, durée d'engagement).
