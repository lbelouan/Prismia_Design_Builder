# WORKFLOW — De l'audio client au HTML de présentation (RDV1)

Processus complet, de l'instant où Timeo dicte un **brief audio** sur un nouveau client
jusqu'à la **livraison du HTML** final. S'appuie sur la DA (`design/`), le template
(`templates/`) et la connaissance interne (`knowledge/`).

**Critère directeur : rapidité de delivery.** Tu ne dictes que la moitié spécifique au
client ; le reste vient de `knowledge/`.

> **Ce document décrit le pipeline RDV1** (scénarios `r1-*`, à socle fixe). Pour les **RDV de
> suivi (R2, R3, +)**, le pipeline est **le même** (gate → lookup/fiche → composition → livraison),
> mais la **composition est LIBRE** : pas de socle imposé, le **nombre de slides et leur contenu
> s'adaptent au contexte** accumulé. Même template, même DA, même boule. Détail :
> `scenarios/suivi-libre.md`. La gate y vérifie surtout **l'objectif du RDV** et **le matériau à
> présenter** (le reste du contexte venant des RDV précédents / fiche prospect / fichiers joints).

---

## Le flux en un coup d'œil

```
  🎙️  AUDIO (brief client dicté, puis transcrit)
        │
        ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. Lire la DA        → design/DESIGN.md + design-system.md    │
  │ 2. Identifier        → client + secteur (depuis le brief)     │
  │ 3. Confronter        → brief × knowledge/ (existe ? nouveau ?) │
  │ 2b LOOKUP+FICHE     → connue ? sinon crée prospects/<slug>.md │
  │ 4. ⚠️ STATUT         → prospect / signé (cf. §B)               │
  │ 5. Matcher les cas   → SIGNÉS uniquement (knowledge/case-studies)│
  │ 6. Composer le deck  → socle fixe + bloc flexible (variable)  │
  │ 7. Générer (clone-and-compose) → clients/<slug>/<slug>-<type>.html │
  └─────────────────────────────────────────────────────────────┘
        │
        ▼
  📄  HTML final livré (ouvrable直接, design figé)
        │
        └──▶ (plus tard) si le client SIGNE → promotion dans knowledge/ (§C)
```

---

## A. Le pipeline, étape par étape

### Entrées
- **Brief audio transcrit** : contexte du client, secteur, maturité IA, constat, enjeux,
  éventuels chiffres, interlocuteurs, date du RDV.
- **`knowledge/`** : company, offers, methodology, case-studies (référentiel Prismia).
- **`design/` + `templates/r1-premier-rdv.html`** : DA figée + template à cloner.

### 0 — Gate de complétude (AVANT de générer)
Si le brief ne fournit pas les **infos minimales**, **poser des questions ciblées et groupées
au client AVANT de générer** — jamais de deck à trous / avec placeholders. Minimum requis :
**(1)** entreprise + secteur · **(2)** interlocuteur (nom + rôle) · **(3)** contexte / maturité IA
actuelle · **(4)** le constat / enjeu principal · **(5)** 1 à 3 pistes / cas d'usage.
*(Optionnel : objectif du RDV, date, périmètre.)* Présent → on continue ; manquant ou flou → on questionne.
> Un lien LinkedIn seul ne suffit pas (mur de connexion) : demander les faits directement.

### 1 — Lire la DA
Charger `design/design-system.md` puis `design/DESIGN.md`. Ne **rien** coder en dur : le
design vit déjà dans le template (`<style>` + `<script>`), on n'y touche pas.

### 2 — Identifier le client et son secteur
Extraire du brief : **nom du client**, **secteur**, interlocuteur(s), date, accroche.
Le secteur pilote le matching des cas (§5) et le ton.

### 2bis — Lookup base de connaissance & fiche prospect
Chercher l'entreprise (par nom) dans `knowledge/case-studies.md` **et** `knowledge/prospects/*.md` :
- **Connue** (signée ou fiche prospect existante) → **charger la fiche** et **compléter le brief
  avec l'acquis** (on ne redemande pas ce qui est déjà au dossier).
- **Nouvelle** → **créer `knowledge/prospects/<slug>.md`** (statut `prospect`) depuis
  `knowledge/prospects/_TEMPLATE.md`, rempli avec le brief.
Dans les deux cas, la fiche prospect est **mise à jour** avec les réponses de la gate (§0) et,
en fin de process, l'historique RDV + le chemin du deck généré.

### 2ter — Recherche web sur l'entreprise
Outil **`WebSearch`** (via la **session** Claude, **sans clé API**) : secteur, taille, actualité,
enjeux récents → enrichit le contexte avant la gate. *(API tierces de données société : plus tard si besoin.)*

### 3 — Confronter le brief à `knowledge/`
Pour chaque élément du brief :
- **Déjà dans `knowledge/`** → on l'utilise tel quel.
- **Nouveau** (nouvelle offre, nouveau chiffre, nouveau cas, nouvelle méthodo) → **le
  signaler** à Timeo et **proposer** de l'ajouter au bon fichier. **N'écrire qu'après
  validation** (règle #2). → voir §C pour le quoi/où.

### 4 — ⚠️ Vérification prospect / signé
**Avant de faire remonter quoi que ce soit dans `knowledge/`** : déterminer le **statut**
du client du brief. Par défaut, un nouveau client = **PROSPECT** (on lui prépare un RDV1).
Conséquence directe : il **n'entre pas** dans le référentiel comme preuve. Détail en §B.

### 5 — Matcher les cas de référence (slide 5)
Piocher dans `knowledge/case-studies.md` les cas **du même secteur / cas d'usage** que le
client. **Uniquement des clients SIGNÉS** (jamais un prospect). Mettre le cas le plus proche
dans la tuile `.hero`. La rangée de logos/chips = clients de référence signés.

### 6 — Composer le deck (socle fixe + bloc flexible)
Remplir automatiquement les slides `knowledge/`, et les slides spécifiques depuis le brief :

| #  | Slide              | Source        | Ce qu'on réécrit |
|----|--------------------|---------------|------------------|
| 1  | cover              | brief         | titre/accroche, méta (Préparé pour, Présenté par, Date, Secteur) |
| 2  | contexte           | brief         | constat + 3 barres de maturité (`data-width`) |
| 3  | diagnostic         | brief         | la tension + 3 cartes (aujourd'hui / risque / cible) |
| 4  | territoires (tabs) | brief+offers  | 3 territoires IA et leurs cas d'usage |
| 5  | études de cas      | case-studies  | cas SIGNÉS du secteur (matching) + logos |
| 6  | différenciateur    | company       | notre différenciateur + chips |
| 7  | méthodologie       | methodology   | les 3 phases |
| 8  | adoption           | methodology+brief | embarquer les équipes / champions |
| 9  | Prismia            | company       | partenaire + 3 cartes ; **4 compteurs FIXES** (cf. §E) — ne pas réécrire |
| 10 | prochaines étapes  | brief         | questions de cadrage du pilote |
| 11 | closing            | company       | contact / signature |

> **Angle par scénario** : le contenu des slides variables (2, 3, 4, 5, 8, 10 + accroche cover)
> se ré-angle selon le `type` du brief (`r1-decouverte` / `r1-carto` / `r1-pilote`). Le détail
> slide-par-slide (mapping + angle par scénario) vit dans **`scenarios/`** (à la racine —
> `_socle.md` + un fichier par type). La knowledge ne contient que de l'**information**.
> Même template, même DA, même boule ; le **nombre de slides est variable** (socle + bloc
> flexible piloté par l'audio). Seuls l'angle et le contenu changent.

### 7 — Générer le HTML (clone-and-compose mono-fichier)
1. Copier `templates/r1-premier-rdv.html` → `clients/<slug>/<slug>-<type>.html` (à côté du brief).
2. **Composer** le bloc `<div class="slides">` (socle + bloc flexible) ; réécrire textes, méta,
   `data-width`, `data-target`, tabs, tuiles de cas.
3. **Ne jamais toucher** au `<style>` ni aux `<script>` → design, animations, 3D et nav garantis.
4. **Nombre de slides variable** : la boule se positionne dynamiquement et `nav-total` se calcule
   seul. Toujours conserver les slides du **socle** (cf. `scenarios/_socle.md`).

### Sortie
`clients/<slug>/<slug>-<type>.html`, **prêt à ouvrir** (un seul fichier, Three.js en CDN).
Export PDF (depuis le dashboard ou `tools/export-pdf.mjs`) → `clients/<slug>/<slug>-<type>.pdf`
dans le **même dossier client**.

---

## B. Règle prospect vs client signé (garde-fou)

> **Un prospect n'est jamais une preuve. Il ne rejoint `knowledge/` comme référence
> qu'une fois SIGNÉ.**

| | **Prospect** (brief / RDV1 en cours) | **Client signé** |
|---|---|---|
| Rôle | Destinataire du deck qu'on génère | Cas de référence, preuve chez les pairs |
| Apparaît en slide 5 (preuves) ? | ❌ **Jamais** | ✅ Oui (matching secteur) |
| Écrit dans `knowledge/case-studies.md` ? | ❌ Non | ✅ Oui, **après validation** (§C) |
| Statut par défaut d'un nouveau brief | **Prospect** | — |

**Vérification à faire à l'étape 4, systématiquement :**
1. Le client du brief est-il **déjà** dans `knowledge/case-studies.md` ? → si oui, c'est une
   référence existante, l'utiliser ; si non, c'est un **prospect** → ne pas l'y ajouter.
2. Si Timeo dit explicitement « **c'est signé** » → proposer la promotion (§C) — pas avant.
3. Lors du matching (§5), **filtrer les prospects** : ne remonter que des clients signés.

> **Mémoire prospect** : chaque prospect a une fiche `knowledge/prospects/<slug>.md` (contexte,
> pistes, historique RDV), créée / mise à jour **automatiquement** par l'orchestrateur. C'est
> une mémoire **par entreprise** — **pas** une preuve : un prospect n'apparaît **jamais** en
> slide 5. Le suivi commercial fin (pipeline / CRM) reste hors périmètre.

---

## C. Écriture dans `knowledge/` (toujours après validation)

Rien n'est écrit dans `knowledge/` sans **accord explicite** (règle #2). Quand le brief
apporte du nouveau, proposer l'ajout au bon fichier :

| Nouveauté détectée dans le brief | Fichier cible |
|---|---|
| Nouvelle offre / solution IA / chiffre d'offre | `knowledge/offers.md` |
| Nouvelle phase / pratique de méthode | `knowledge/methodology.md` |
| Nouveau positionnement / différenciateur / stat entreprise | `knowledge/company.md` |
| **Client qui vient de SIGNER** → nouveau cas de référence | `knowledge/case-studies.md` |

**Promotion d'un prospect signé** vers `knowledge/case-studies.md` (au format des fiches
taguées) — uniquement quand Timeo confirme la signature :
```
### <Nom du client>
- secteur:        # pour le matching
- cas-usage:
- contexte:
- solution:
- resultat:       # chiffre / gain mesurable
- citation:       # verbatim (si dispo)
```

---

## D. Checklist avant livraison

- [ ] **Brief complet** (infos minimales §0) — sinon, questions posées et réponses obtenues AVANT de générer.
- [ ] DA lue ; aucun style/script du template modifié.
- [ ] Client + secteur identifiés ; statut **prospect/signé** tranché (§B).
- [ ] Slides brief (2, 3, 4, 10) réécrites depuis l'audio.
- [ ] Slides knowledge (5, 6, 7, 9, 11) remplies depuis `knowledge/`.
- [ ] Slide 5 = **uniquement des clients signés**, matchés par secteur.
- [ ] Nouveautés du brief **signalées** et écrites dans `knowledge/` **seulement si validées**.
- [ ] Slides du **socle** présentes ; nombre total libre (socle + bloc flexible) ; `data-width` / `data-target` cohérents.
- [ ] Fichier livré dans `clients/<slug>/<slug>-<type>.html`, ouvrable directement.
- [ ] Slide 9 : 4 compteurs **inchangés** (§E) ; décor 3D = la **boule**, pas le TorusKnot.

---

## E. Éléments FIXES du deck (jamais personnalisés)

1. **Slide 9 — 4 compteurs imposés**, toujours identiques (ne PAS utiliser les KPIs BDR) :
   `3` Années d'accompagnement IA · `~60` ETI accompagnées · `~150` Projets menés ·
   `3000` Développeurs & experts data / ML mobilisables. Déjà câblés dans le template ;
   l'orchestrateur ne réécrit que les 3 cartes en dessous.
2. **Décor 3D = la « boule »** (rendu CSS façon Claude Design : blob iridescent + anneaux),
   jamais le TorusKnot WebGL. Forcé dans le template (`FORCE_BALL = true`).
