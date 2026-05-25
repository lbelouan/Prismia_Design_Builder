# Cas de référence — Prismia

> Source : `etudes_de_cas_prismia.md` + document « Études de cas — Base de référence » (format
> détaillé, 2026-05-25). Cas de référence Prismia, taggués par `secteur` / `cas-usage`.
> **Règle d'or : parler ROI métier, pas techno** (combien ça coûte, combien ça rapporte, en
> combien de temps, qui doit s'impliquer). **Citations clients : « à recueillir auprès du
> sponsor »** (non encore collectées).

## Convention de fiche
`secteur` / `cas-usage` (tags de matching) · **En une phrase** · **Contexte** (qui, secteur,
taille) · **Douleurs** (le problème AVANT, quantifié) · **Ce qui a été fait (Prismia)**
(méthodo + briques) · **Résultat** (KPI clé) · citation.

---

## Cas nominatifs (clients signés)

### Le Maître Sécurité — x10 temps de recherche produit en RDV
*Réf : le-maitre-securite-chatbot-catalogue*
- **secteur** : industrie / fabrication (EPI, chaussures de sécurité) · ~30 commerciaux, France + frontaliers · **cas-usage** : assistant IA interne (RAG) sur catalogue + documents, on-premise
- **En une phrase** : grâce à un assistant IA interne connecté au catalogue, les commerciaux trouvent en quelques secondes les produits conformes (certifications, fiches techniques, documents) face au client.
- **Contexte** : PME spécialisée dans la fabrication et la distribution de chaussures de sécurité. Force commerciale d'une trentaine de commerciaux (France + pays frontaliers) et des grossistes partenaires. Les exigences de conformité (normes, certifications, documents techniques) sont centrales → l'accès rapide et fiable à l'info produit est un enjeu **direct** de performance commerciale.
- **Douleurs** : sur le terrain, du temps précieux perdu à chercher le bon produit dans un catalogue riche, puis à retrouver les documents associés (fiches techniques, certifications, conformité). En RDV, ces frictions rallongent les échanges, créent des incertitudes et ralentissent la décision d'achat. Le tout sans compromettre la confidentialité des données.
- **Ce qui a été fait (Prismia)** — rendre l'accès à l'information fiable, rapide et actionnable en situation réelle, avec un haut niveau de confidentialité :
  - **Structuration du catalogue + documents** (fiches techniques, certifications, conformité) pour une recherche fiable
  - **Assistant IA interne en langage naturel** (retrouver un produit selon des critères de normes / certifications)
  - **Réponses documentées** : fiches et extraits utiles fournis avec les bons documents associés
  - **Déploiement on-premise** (serveurs du client) pour sécurité, gouvernance et évolutions maîtrisées
- **Résultat** : **x10** — recherche produit de ~5 min à ~30 sec, directement en rendez-vous · citation : à recueillir
- *Cas proche : industrie + RAG documentaire / conformité.*

### Car-Market — x10 estimation du prix marché (1 clic)
*Réf : car-market-estimation-prix-marche-vehicule*
- **secteur** : automobile B2B (achat-revente d'occasion, Belgique) · **cas-usage** : modèle ML d'estimation du prix marché
- **En une phrase** : Car-Market dépendait d'un expert pour estimer ses achats/reventes ; Prismia a déployé un modèle d'estimation du prix marché, utilisable en quelques secondes sur n'importe quelle annonce.
- **Contexte** : entreprise belge spécialisée dans l'achat-revente de véhicules d'occasion à destination des professionnels. L'activité repose sur une forte réactivité : identifier un véhicule intéressant, estimer son prix marché, décider vite. Volume régulier + marché très concurrentiel → chaque minute gagnée sur l'analyse améliore directement la capacité à acheter au bon prix.
- **Douleurs** : l'estimation du « juste prix » dépendait d'un savoir-faire **centralisé** (une personne clé analysait le marché, comparait, validait). Résultat : ralentissements, goulots d'étranglement, et risque de passer à côté de bonnes opportunités. Objectif : rendre l'estimation accessible à toute l'équipe, en un clic, de façon cohérente et reproductible.
- **Ce qui a été fait (Prismia)** — transformer une estimation « au feeling / à l'expérience » en un système reproductible, mesurable et utilisable par toute l'équipe :
  - Définition des **variables et règles métier** (ce qui impacte réellement la valeur)
  - **Construction et nettoyage d'une base de données** à grande échelle (interne + marché)
  - Comparaison **déterministe vs machine learning** pour retenir l'approche la plus fiable
  - Livraison d'un usage simple (**« 1 clic » depuis une annonce**) pour accélérer la décision
- **Résultat** : **x10** — estimation de ~5 min à ~30 sec, directement depuis une annonce · citation : à recueillir

### Car-Market — x15 capacité d'analyse d'annonces
*Réf : car-market-analyse-automatique-annonces-vehicules*
- **secteur** : automobile B2B (occasion, Belgique) · **cas-usage** : scraping multi-sites + priorisation/scoring IA
- **En une phrase** : l'équipe ne pouvait analyser que 1 000 à 2 000 véhicules/jour ; Prismia a automatisé le scraping multi-sites et la priorisation IA pour ne remonter que les annonces les plus rentables.
- **Contexte** : acteur B2B de l'achat-revente où la vitesse d'exécution fait la différence : plus on analyse d'annonces, plus on augmente ses chances de capter des véhicules sous-prix marché. Limiter l'analyse à quelques milliers d'annonces/jour créait mécaniquement un **manque à gagner** (opportunités non vues, décisions plus lentes).
- **Douleurs** : le problème n'était pas l'accès aux annonces, mais la **capacité à les traiter à grande échelle**. Capacité humaine plafonnée à ~1 000–2 000 véhicules/jour face au volume disponible sur le marché.
- **Ce qui a été fait (Prismia)** — transformer un flux massif d'annonces en une shortlist quotidienne actionnable pour les acheteurs :
  - **Scraping multi-sources** (collecte sur plusieurs sites concurrents) + normalisation des données
  - **Pipeline Python robuste** (qualité des données, déduplication, mises à jour)
  - **Priorisation IA** : scoring des annonces via le modèle de rentabilité déjà développé
  - **Shortlist quotidienne** pour concentrer l'analyse humaine sur l'essentiel
- **Résultat** : **x15** — de 1 000–2 000 à **30 000 véhicules/jour**, sans charge manuelle supplémentaire · citation : à recueillir

### Daylindo — autonomie lead gen en 8 semaines
*Réf : daylindo-autonomie-leadgen-outils-ia*
- **secteur** : SaaS (transmission et suivi des compétences en situation de travail, B2B) · **cas-usage** : structuration + formation prospection (liste → enrichissement → outreach)
- **En une phrase** : Daylindo voulait industrialiser sa prospection sans dépendre d'un expert interne ; Prismia a structuré la méthode, les outils et les premiers workflows pour rendre l'équipe autonome sur toute la chaîne lead gen.
- **Contexte** : éditeur d'une plateforme SaaS dédiée à la formation terrain, au tutorat et à la traçabilité des compétences. L'équipe commerciale devait structurer sa génération de leads pour alimenter le pipeline régulièrement, tout en gardant un haut niveau de qualité sur les listes et les prises de contact.
- **Douleurs** : pas un manque d'outils, mais l'absence d'un **système clair et reproductible** — comment construire des listes propres, enrichir avec les bonnes données, lancer des séquences efficaces et piloter la performance, sans dépendre d'une personne « experte ».
- **Ce qui a été fait (Prismia)** — transformer une prospection « à l'instinct » en système simple, répétable et pilotable, en rendant l'équipe autonome :
  - **Audit** des outils et du process existant (ce qui marche / ce qui bloque)
  - **Plan d'action** clair : sources de leads, critères de ciblage, règles de qualité des données
  - **Formation** à la chaîne lead gen (list building → enrichissement → outreach) avec bonnes pratiques
  - **Co-création des premières campagnes** + routines de pilotage (pour ancrer l'autonomie)
- **Résultat** : **8 semaines** pour rendre l'équipe autonome (création de listes, enrichissement, premières campagnes) · citation : à recueillir

### ID Neuve — x2+ capacité d'analyse de contrats
*Réf : id-neuve-extraction-contrats-assurance-ia*
- **secteur** : assurance / courtage (optimisation de contrats) · **cas-usage** : extraction & structuration IA de documents (PDF non uniformes)
- **En une phrase** : les équipes passaient trop de temps à lire et comparer des contrats non uniformes ; Prismia a automatisé l'extraction et la structuration des données pour accélérer l'analyse et le conseil client.
- **Contexte** : ID Neuve accompagne ses clients dans le choix et l'optimisation de leurs contrats (assurance, garanties, conditions). Sa valeur repose sur la capacité à analyser rapidement des contrats de compagnies différentes, aux formats hétérogènes (PDF, tableaux, annexes). Plus l'équipe traite de dossiers, plus elle propose des recommandations pertinentes — avec une forte exigence de confidentialité.
- **Douleurs** : pas un manque d'informations, mais du temps perdu à les retrouver. Contrats **non uniformisés** (structure, termes et tableaux changent selon l'assureur) → analyse lente, difficile à standardiser, **plafonnant le volume** (limite ~500 dossiers/client/an).
- **Ce qui a été fait (Prismia)** — transformer des documents hétérogènes (PDF + tableaux) en données structurées comparables, compatibles avec l'outil métier et les contraintes de confidentialité :
  - **Cartographie des données à extraire** (garanties, exclusions, montants, franchises, conditions)
  - **Moteur d'extraction IA** sur documents non uniformes (PDF + tableaux complexes)
  - **Normalisation des sorties** (format commun pour comparer plusieurs contrats)
  - **Intégration au workflow ID Neuve** (lancement, restitution, exploitation)
- **Résultat** : **x2+** — au-delà de la limite de 500 dossiers/client/an, sans recruter · citation : à recueillir

### Cafés Di-Costanzo — −60% temps de saisie (CRM terrain sur-mesure)
*Réf : cafes-di-costanzo-crm-sur-mesure-commerciaux-terrain*
- **secteur** : agroalimentaire / torréfaction (B2B CHR & entreprises, Gers) · **cas-usage** : CRM sur-mesure pour commerciaux terrain
- **En une phrase** : un CRM « old school » freinait la saisie terrain et la qualité du suivi ; Prismia a conçu un CRM agile, pensé pour les commerciaux, pour augmenter le volume et la régularité des actions commerciales.
- **Contexte** : artisan torréfacteur basé dans le Gers, activité B2B forte auprès de professionnels (CHR, entreprises) et développement soutenu. Un suivi commercial précis (historique, besoins, prochaines actions) est clé pour augmenter le nombre de nouveaux clients et la récurrence.
- **Douleurs** : le CRM existant était **trop rigide pour le terrain** (saisie longue, champs peu adaptés, faible adoption). Résultat : informations incomplètes, relances moins systématiques, historique client difficile à exploiter.
- **Ce qui a été fait (Prismia)** — concevoir un CRM sur-mesure centré sur l'usage réel des commerciaux, puis itérer jusqu'à un outil rapide, clair et adopté :
  - **Audit des usages terrain** + cartographie des informations réellement utiles
  - Définition des **fonctionnalités et du pipeline** (visites, relances, opportunités)
  - **Prototypage** d'interfaces et de parcours simples (saisie rapide, historique lisible)
  - **Optimisation + formation** pour assurer l'adoption et la régularité d'utilisation
- **Résultat** : **−60%** — saisie après visite de ~5–10 min à 2–4 min, directement sur le terrain · citation : à recueillir

### Cafés Di-Costanzo — −95% délai de proposition commerciale
*Réf : cafes-di-costanzo-automatisation-propositions-commerciales*
- **secteur** : agroalimentaire / torréfaction (B2B, commerciaux mobiles) · **cas-usage** : génération automatique d'offres/devis (catalogue + templates)
- **En une phrase** : avant, les commerciaux passaient par l'ADV et attendaient (souvent le lendemain) ; Prismia a automatisé la création d'offres à partir d'un catalogue et de templates, pour répondre plus vite et signer plus souvent.
- **Contexte** : torréfacteur en forte croissance, activité B2B importante (CHR, entreprises), commerciaux souvent en déplacement. La réactivité fait la différence : plus une offre est envoyée vite après le RDV, plus les chances de conversion augmentent.
- **Douleurs** : le problème n'était pas « faire des devis » mais le **délai**. Les commerciaux transmettaient les infos à l'ADV puis attendaient la proposition — parfois le lendemain. Avec une ADV sollicitée, l'équipe perdait en vélocité et la fenêtre de décision se refermait.
- **Ce qui a été fait (Prismia)** — standardiser la logique d'offre puis la rendre actionnable sur le terrain via un outil qui génère une proposition depuis un template :
  - **Audit du workflow** commercial/ADV et des frictions (délai, erreurs, allers-retours)
  - **Structuration du catalogue + options + règles de pricing** (base fiable)
  - **Génération automatique d'offres depuis des templates** (cohérence + rapidité)
  - **Intégration au CRM** + formation pour adoption immédiate
- **Résultat** : **−95%** — d'« au lendemain » à moins d'1 heure, directement par les commerciaux · citation : à recueillir

### Exosens — x5 vitesse de qualification marché
*Réf : exosens-etude-marche-b2b-ia-verticales*
- **secteur** : semi-conducteurs / défense (opto-électronique, B2B technique — confidentiel) · **cas-usage** : étude de marché B2B augmentée IA + plan d'action GTM
- **En une phrase** : Exosens voulait lancer de nouvelles verticales stratégiques en 18 mois ; Prismia a industrialisé la recherche de cas d'usage et livré un plan d'action prêt à exécuter (priorités, acteurs clés, contacts).
- **Contexte** : adresse des marchés B2B avec des produits techniques, où la croissance dépend de la capacité à choisir les bonnes verticales et à activer rapidement les bons interlocuteurs. Enjeu : sécuriser des relais de croissance significatifs sur 18 mois, avec un livrable directement exploitable par le commercial et la direction (pas une étude théorique).
- **Douleurs** : pas « trouver des idées » mais trouver **les bonnes**, validées par le marché, et les transformer en plan d'action. Une étude classique prenait du temps, restait souvent trop générique, et ne débouchait pas sur une exécution immédiate (acteurs à contacter, signaux, priorités).
- **Ce qui a été fait (Prismia)** — passer d'une recherche marché lente et fragmentée à une base de décision + un plan de prospection directement exploitable :
  - **Prototype rapide** pour valider l'approche et aligner les critères de sélection
  - **Analyse IA à grande échelle** : cas d'usage, signaux d'adoption, acteurs déjà en place
  - **Ateliers avec experts produit** : filtre « fit » technique + faisabilité de déploiement
  - **Enrichissement des comptes** (contacts) + **export CRM** pour déclencher l'exécution
- **Résultat** : **x5** — recherche manuelle dispersée → shortlist structurée + plan d'action en quelques semaines · citation : à recueillir
- *Cas proche : industrie / semi-conducteurs, go-to-market & verticales.*

### Family Ventures — −70% temps de mise au propre (post-réunion)
*Réf : family-ventures-automatisation-todo-post-reunion-plan-action*
- **secteur** : investissement / VC (collectif d'investisseurs) · **cas-usage** : automatisation des plans d'action post-réunion + relances
- **En une phrase** : après chaque réunion, les actions se perdaient entre prises de notes, tableurs et relances manuelles ; Prismia a automatisé la création du plan d'action et les relances pour augmenter le taux d'exécution.
- **Contexte** : collectif d'investisseurs, activité rythmée par des échanges réguliers (réunions internes, suivi de deals, mentoring, comités). La performance dépend autant de la qualité des décisions que de la capacité à exécuter rapidement les actions derrière chaque réunion.
- **Douleurs** : pas un manque d'idées, mais des **actions perdues en route**. Après réunion : prendre des notes, mettre à jour des tableurs, assigner manuellement, relancer régulièrement → tâches oubliées, allers-retours, visibilité incomplète sur l'avancement.
- **Ce qui a été fait (Prismia)** — supprimer la « dette d'exécution » post-réunion : transformer les réunions en actions structurées puis automatiser le suivi :
  - **Cadrage du format d'actions** (owner, deadline, priorité, statut)
  - **Génération automatique du plan d'action** à partir des réunions fournies
  - **Relances et rappels automatisés** (sans micro-management manuel)
  - **Vue de pilotage** (avancement, blocages, retards)
- **Résultat** : **−70%** — mise au propre des actions de 30–60 min à 5–15 min par réunion · citation : à recueillir

### Vavril — x10 vitesse d'optimisation SEO (1 000+ articles)
*Réf : vavril-optimisation-seo-ia-1000-articles*
- **secteur** : contenu / SEO (fort volume d'articles) · **cas-usage** : optimisation SEO industrialisée par IA (texte + images)
- **En une phrase** : Vavril avait un gros volume de contenus mais pas de méthode scalable ; Prismia a structuré une stratégie SEO claire puis automatisé l'optimisation (texte + images) pour une mise à niveau à grande échelle.
- **Contexte** : s'appuie fortement sur le SEO pour générer du trafic qualifié. Avec un volume important d'articles, l'enjeu n'est plus « écrire » mais maintenir une **qualité SEO homogène dans le temps** (bons mots-clés, contenus à jour, structure claire, images optimisées, cohérence éditoriale).
- **Douleurs** : la **scalabilité** — optimiser 1 000+ articles à la main prend des mois, et les actions se perdent (titres, maillage, intents, images, cannibalisation).
- **Ce qui a été fait (Prismia)** — clarifier la stratégie (quels mots-clés, quels intents) puis transformer ces décisions en exécution rapide via un workflow IA, avec contrôles qualité :
  - **Audit mots-clés + intent + priorisation** (quoi optimiser en premier)
  - **Sélection et prise en main d'outils IA** du marché (sans réinventer la roue)
  - **Workflow d'optimisation industrialisé** (structure, titres, sections, FAQ, maillage)
  - **Optimisation des images + checklist QA** pour homogénéiser la qualité
- **Résultat** : **x10** — d'un travail « article par article » à un workflow IA sur +1 000 contenus · citation : à recueillir

### Blush Concept Store — −70% temps de recherche produit
*Réf : blush-chatbot-recommandation-produit-ecommerce*
- **secteur** : e-commerce / retail (concept store mode & lifestyle, Lyon, fondé 2007) · **cas-usage** : chatbot RAG de recommandation produit
- **En une phrase** : quand le catalogue s'élargit, les clients hésitent et abandonnent ; Prismia a déployé un chatbot « conseiller » connecté aux fiches produits pour guider la navigation et accélérer la décision.
- **Contexte** : concept store mode & lifestyle avec un e-shop et plusieurs boutiques à Lyon. Univers mêlant bijoux, vêtements et décoration, avec une sélection de créateurs et des références qui évoluent souvent → aider un visiteur à trouver « la bonne pièce » rapidement devient un enjeu direct de conversion.
- **Douleurs** : pas le catalogue, mais la **friction pour choisir** : trop de choix, filtres pas toujours évidents, besoins exprimés « à la façon humaine » (style, usage, budget, cadeau, tailles, matières).
- **Ce qui a été fait (Prismia)** — transformer le catalogue en base de connaissance exploitable en langage naturel, avec un chatbot de recommandation qui renvoie vers les bonnes pages produits, mis à jour automatiquement :
  - **Structuration des fiches produits** (attributs, variantes, infos décisives)
  - **Chatbot RAG** (cherche dans les fiches Blush, pas sur le web)
  - **Parcours conversationnel orienté conversion** : shortlist + liens directs
  - **Synchronisation CMS** + contrôle qualité (réponses cohérentes, à jour)
- **Résultat** : **−70%** — recherche avant le bon produit de 3–6 min à 30–90 sec · citation : à recueillir

### Parfi — −60% temps pour trouver le bon produit
*Réf : chatbot-recommandation-parapluie-parfi*
- **secteur** : e-commerce (parapluies & accessoires, parfi.be) · **cas-usage** : chatbot de recommandation produit (RAG sourcé)
- **En une phrase** : sur Parfi.be, les clients hésitaient entre modèles, tailles et usages (ville, vent, voyage) ; Prismia a mis en place un chatbot qui oriente vers le bon parapluie, rapidement et sans jargon.
- **Contexte** : vente en ligne de parapluies et accessoires, avec des gammes et caractéristiques proches (long/court, automatique, résistance au vent, poignée…). Le vrai frein n'est pas le produit : c'est **le choix** (trop d'options, trop de pages à comparer, questions répétitives avant achat).
- **Douleurs** : quand un client hésite, il abandonne vite. Besoin de réduire la friction de décision et de guider vers le bon modèle sans forcer le parcours — « comme un conseiller en boutique », directement sur le site.
- **Ce qui a été fait (Prismia)** — construire un parcours de recommandation fiable connecté au catalogue, pour guider sans inventer d'infos :
  - **Structuration des données produit** (attributs, usages, contraintes, variantes)
  - **Moteur de recommandation via RAG** (réponses avec sources, sans halluciner)
  - **Scénarios conversationnels** (cadeau, vent, usage pro, transport, budget)
  - **Mise à jour du catalogue** (process + connecteurs CMS selon l'existant)
- **Résultat** : **−60%** — temps pour trouver « le bon parapluie » divisé par ~2 (de quelques minutes à ~1–2 min) · citation : à recueillir

### SoftEdge Studio — +20% de leads
*Réf : softedge-prospection-b2b-ia-automatisation*
- **secteur** : agence de communication (design + développement) · **cas-usage** : prospection B2B IA + automatisation
- **En une phrase** : SoftEdge voulait générer plus d'opportunités sans passer ses journées à chercher des prospects et relancer à la main ; Prismia a industrialisé la prospection avec des outils IA + automatisation.
- **Contexte** : agence de communication multidisciplinaire à l'intersection du design et du développement. Enjeu commercial : remplir le pipe de demandes qualifiées, sans dégrader la qualité de delivery ni dépendre uniquement du bouche-à-oreille.
- **Douleurs** : pas un manque d'offres, mais un manque de **régularité** dans l'acquisition. Entre la production, les projets en cours et la recherche de prospects, la prospection passait souvent en dernier.
- **Ce qui a été fait (Prismia)** — clarifier la cible et les offres, puis mettre en place un système outillé (IA + automatisation) qui réduit le temps sur les tâches répétitives tout en gardant une personnalisation crédible :
  - **Ciblage & segmentation** : ICP, signaux, critères « bon fit »
  - **Génération de listes + enrichissement** (contacts, infos utiles, signaux)
  - **Personnalisation assistée par IA** (messages courts, adaptés au contexte)
  - **Cadence + relances + suivi pipeline** (process simple, mesurable)
- **Résultat** : **+20%** de croissance de leads sur la période d'accompagnement · citation : à recueillir

### WebEcode — +1 vente en 14 jours
*Réf : webecode-prospection-b2b-ia-automatisation*
- **secteur** : agence digitale éco-responsable (sites web, Liège) · **cas-usage** : prospection B2B IA + automatisation
- **En une phrase** : WebEcode voulait structurer une prospection B2B régulière sans y passer ses soirées ; Prismia a mis en place un workflow IA pour cibler, enrichir et contacter les bons prospects, avec un suivi de relance clair.
- **Contexte** : agence digitale éco-responsable basée à Liège, spécialisée dans la création et l'optimisation de sites web. L'offre était prête, mais l'acquisition dépendait trop des opportunités « au fil de l'eau ». Enjeu : passer d'une prospection ponctuelle à un système simple, répétable et mesurable.
- **Douleurs** : pas un manque de prospects, mais un manque de **process** : qui contacter, quoi dire, quand relancer, comment suivre les réponses — sans s'éparpiller.
- **Ce qui a été fait (Prismia)** — transformer une prospection « au feeling » en machine simple : clarifier la cible, outiller la production de listes, accélérer la personnalisation et mettre la relance sur des rails (sans spam) :
  - **Ciblage & segmentation** (ICP, signaux, critères « bon fit »)
  - **List building + enrichissement** (contacts, données actionnables)
  - **Messages assistés par IA** (personnalisation courte, crédible, orientée valeur)
  - **Cadence + relances + suivi** (pipeline clair, routine hebdo, mesure)
- **Résultat** : **+1 vente** — première vente signée 14 jours après le lancement des campagnes · citation : à recueillir

### VR Agency — +10% d'impact prospection
*Réf : vr-agency-prospection-b2b-ia-workflow*
- **secteur** : agence web (sites, e-commerce, dev sur-mesure, marketing, Bruxelles) · **cas-usage** : workflow de prospection B2B IA
- **En une phrase** : VR Agency voulait éviter les « pics de prospection » suivis de silence ; Prismia a mis en place un workflow IA pour cibler, personnaliser et relancer proprement, sans alourdir l'équipe.
- **Contexte** : agence web basée à Bruxelles (sites, e-commerce, développement sur mesure, marketing digital). Enjeu : générer plus d'opportunités B2B sans sacrifier la production et la qualité des projets.
- **Douleurs** : pas un manque d'idées, mais un manque de **constance** — quand l'équipe est prise par la prod, la prospection passe après. Résultat : relances oubliées, listes pas à jour, pipeline dépendant des périodes « où on a le temps ».
- **Ce qui a été fait (Prismia)** — rendre la prospection régulière et mesurable sans la rendre lourde : ciblage clarifié, production de listes industrialisée, personnalisation via IA, relances sur des rails (contrôle humain) :
  - **Segmentation & signaux** (priorisation des comptes à contacter)
  - **List building + enrichissement** (contacts + infos actionnables)
  - **Messages assistés par IA** (courts, contextualisés, orientés valeur)
  - **Cadence + relances + suivi pipeline** (routine simple, mesurable)
- **Résultat** : **+10%** d'impact mesuré (régularité, relances, volume d'actions réalisées) · citation : à recueillir

### ALMA Group — x6 décision accélérée (roadmap en 14 j)
*Réf : audit-ia-alma-group-roadmap-projets-pilotes*
- **secteur** : industrie / énergies (mesure, sécurisation & contrôle des transferts de fluides, présent dans 40+ pays) · **cas-usage** : audit IA + roadmap de projets pilotes (gouvernance)
- **En une phrase** : ALMA Group voulait « bien démarrer » l'IA sans lancer 10 chantiers en parallèle ; Prismia a mené un audit court et structuré pour identifier les projets pilotes prioritaires par pôle, avec une roadmap claire sur 2026.
- **Contexte** : groupe industriel français fournissant des solutions industrielles et digitales autour de la mesure et du contrôle des transferts de fluides, présence internationale (40+ pays). Face à l'essor des cas d'usage IA, la direction voulait une approche pragmatique : identifier rapidement où l'IA apporte un ROI réel, sans mettre l'organisation en risque.
- **Douleurs** : pas un manque d'idées — chaque pôle avait des intuitions, mais **aucune vision partagée** sur quoi prioriser, quoi éviter, et par où commencer. Risque : des POC isolés, difficiles à industrialiser, sans sponsor métier.
- **Ce qui a été fait (Prismia)** — transformer des idées IA dispersées en plan de déploiement réaliste : écouter le terrain, recadrer par objectifs business, prioriser avec une grille simple (impact, effort, risques, prérequis) :
  - **Interviews structurées par pôle** (objectifs, irritants, contraintes, données)
  - **Benchmark de cas d'usage IA** pertinents (industrie / énergies)
  - **Scoring & priorisation** (impact / faisabilité / dépendances)
  - **Roadmap 2026** (Q1, Q2, Q3-Q4) + prérequis (données, sécurité, outillage, sponsors)
- **Résultat** : **x6** — d'une priorisation qui traîne sur plusieurs mois à une roadmap IA actionnable en 14 jours · citation : à recueillir
- *Cas proche : industrie / énergies / fluides + gouvernance & roadmap.*

### DENIS — +21% productivité bureau d'études
*Réf : audit-ia-denis-productivite-bureau-etudes*
- **secteur** : industrie (équipements industriels, ~200 salariés, France + international) · **cas-usage** : audit IA du bureau d'études (de la demande à l'offre)
- **En une phrase** : le bureau d'études était un goulot d'étranglement (demandes, clarifications, chiffrage, rédaction, envoi d'offres) ; Prismia a cartographié le process et priorisé 5 projets IA, avec un ROI clair.
- **Contexte** : conçoit et fabrique des équipements industriels, avec ses propres bureaux d'études et une activité France + international (~200 salariés, réseau commercial et de distribution large). La direction voulait identifier où l'IA peut réellement soulager le bureau d'études, sans compromettre la confidentialité ni lancer des chantiers « au feeling ».
- **Douleurs** : pas un manque d'outils, mais un process **long, fragmenté et très dépendant des bonnes personnes**, où chaque dossier nécessite des allers-retours et du temps de recherche → délais variables, charge mentale, opportunités commerciales parfois perdues.
- **Ce qui a été fait (Prismia)** — rendre visible le vrai coût des frictions dans le traitement d'un dossier, puis le transformer en décisions actionnables (business cases IA crédibles) :
  - **Cadre de confidentialité** + collecte des données utiles (sans sur-exposer l'interne)
  - **Process mapping complet** (de la demande client à l'envoi de l'offre)
  - **Identification de 5 solutions IA** par étape (clarification, recherche, rédaction, validation…)
  - **Business case par solution** (ROI + faisabilité technique + délai + impact opérationnel)
- **Résultat** : **+21%** de productivité du bureau d'études (estimé) + **+15%** de croissance via 5 solutions IA priorisées · citation : à recueillir

### SEDI-ATI — +16% productivité commerciale
*Réf : audit-ia-sedi-ati-productivite-equipe-commerciale*
- **secteur** : industrie (composants/assemblages passifs en fibre optique ; défense, aérospatial) · **cas-usage** : audit IA traitement des leads entrants (marketing + sales)
- **En une phrase** : l'équipe commerciale était sous l'eau face aux leads entrants ; Prismia a cartographié le process (marketing + sales) et livré une roadmap IA réaliste, orientée traitement plus rapide et mieux qualifié.
- **Contexte** : conçoit et fabrique des composants et assemblages passifs en fibre optique, souvent pour des environnements exigeants (défense, aérospatial, industrie). Reçoit des demandes entrantes variées, avec un enjeu fort : répondre vite, bien qualifier, ne pas perdre d'opportunités faute de bande passante côté sales.
- **Douleurs** : pas un manque de leads, mais la **capacité à les traiter** avec le bon niveau de soin sans noyer l'équipe dans des tâches répétitives (tri, recherche d'info, relances, suivi) → priorisation difficile, délais qui s'allongent, deals laissés passer.
- **Ce qui a été fait (Prismia)** — augmenter la capacité de traitement sans sacrifier la qualité de qualification : comprendre le process réel, identifier les frictions, proposer des chantiers IA priorisés avec business case :
  - **Interviews structurées** (sales + marketing) + **process mapping complet**
  - **Analyse des outils existants** (CRM, boîtes mail, formulaires, suivi) et des points de rupture
  - **Roadmap IA priorisée** selon 4 axes : ROI / technique / temps / opérationnel
  - **Recommandations actionnables** (qui fait quoi, prérequis data, intégrations, risques)
- **Résultat** : **+16%** de productivité sur le traitement des leads entrants (estimé) · citation : à recueillir

### RECMA — +15% croissance & −26% charge interne
*Réf : audit-ia-recma-prospection-automatisation*
- **secteur** : services / économie sociale (nettoyage B2B, insertion socio-professionnelle, Belgique) · **cas-usage** : audit IA prospection + automatisations internes
- **En une phrase** : RECMA avait deux enjeux en parallèle — accélérer la prospection et fluidifier la logistique/l'organisation interne ; Prismia a livré une roadmap claire : 7 automatisations IA et un plan d'exécution priorisé.
- **Contexte** : entreprise belge engagée dans l'économie sociale, activités de services (notamment nettoyage B2B) et mission d'insertion socio-professionnelle. Chaque gain de productivité compte : moins de répétitif, plus de temps utile sur le terrain, organisation plus fluide.
- **Douleurs** : pas « faire de l'IA », mais **réduire la friction au quotidien** : gagner en régularité commerciale sans alourdir les équipes, tout en supprimant des irritants internes (logistique, coordination, communication).
- **Ce qui a été fait (Prismia)** — moins de tâches répétitives, plus d'impact commercial : comprendre le terrain, isoler les goulots, transformer en plan d'action IA priorisé (pas une liste d'outils) :
  - **Interviews structurées** (commercial + opérations) et **process mapping « réel »**
  - **Leviers de prospection boostée par IA** (listes, enrichissement, séquences)
  - **Automatisations internes à fort impact** (logistique / organisation / communication)
  - **Roadmap priorisée** (ROI, faisabilité, délai, adoption) + recommandations d'implémentation
- **Résultat** : **+15%** de croissance commerciale (an 1) via prospection IA + **−26%** de charge interne (6 mois, 7 automatisations) · citation : à recueillir

### DAP (Degauquier & Partners) — x2 traitement de dossiers
*Réf : audit-ia-dap-rag-assurance*
- **secteur** : assurance & crédit (courtier indépendant, plusieurs bureaux, Belgique) · **cas-usage** : audit IA + RAG documentaire priorisé
- **En une phrase** : les équipes perdaient du temps à retrouver « le bon document au bon moment » (CG, clauses, procédures) ; Prismia a livré une roadmap IA centrée sur un RAG pour réduire la recherche documentaire et fiabiliser les réponses.
- **Contexte** : courtier indépendant en assurances et crédits, présent via plusieurs bureaux en Belgique. Les équipes gèrent un volume important de demandes et de dossiers (particuliers et professionnels), avec une forte dépendance à des documents de référence (conditions générales, procédures, pièces contractuelles).
- **Douleurs** : pas un manque d'outils, mais du **temps perdu en recherche** et un risque de réponses incomplètes quand la pression monte — sans fragiliser la conformité.
- **Ce qui a été fait (Prismia)** — moins de recherche manuelle, plus d'analyse et de conseil : comprendre les flux, qualifier les données, transformer en roadmap exécutable :
  - **Interviews + process mapping** (où se perd le temps, où se perd l'info)
  - **Analyse documentaire** : types de documents, mises à jour, sources « de vérité »
  - Définition d'un **RAG « safe »** : réponses sourcées + traçabilité + règles d'usage
  - **Roadmap priorisée** (ROI, faisabilité, délai, adoption) + prérequis data & sécurité
- **Résultat** : **x2** — roadmap centrée RAG pour accélérer le traitement des dossiers (assurance & crédit) · citation : à recueillir

### Cafés Di-Costanzo — +11% productivité sales (audit + 2 pilotes)
*Réf : audit-ia-cafes-di-costanzo-productivite-sales*
- **secteur** : agroalimentaire / torréfaction (e-commerce B2C + B2B CHR/bureaux) · **cas-usage** : audit IA express + 2 projets pilotes déployés
- **En une phrase** : les équipes commerciales perdaient du temps sur des tâches répétitives (suivi, relances, recherche d'infos, préparation) ; Prismia a mené un audit express et transformé les constats en 2 projets IA déployés rapidement.
- **Contexte** : torréfacteur français adressant à la fois les particuliers (e-commerce) et les professionnels (CHR, bureaux). Sur le terrain, la performance commerciale dépend de la réactivité, du bon suivi client et de la capacité à absorber les demandes sans alourdir l'administratif.
- **Douleurs** : pas « mettre de l'IA partout », mais **identifier où le temps se perd réellement**, puis sécuriser des quick wins concrets et adoptables par l'équipe.
- **Ce qui a été fait (Prismia)** — moins d'administratif, plus de temps commercial : audit court, priorisation stricte, exécution rapide sur 2 pilotes :
  - **Interviews + process mapping** (où se perd le temps, où ça bloque)
  - **Identification des quick wins IA** (automatisation, assistants, workflows)
  - **Priorisation** par ROI / faisabilité / délai / adoption
  - **Mise en place des 2 pilotes** + accompagnement à l'usage (routines, KPI, itérations)
- **Résultat** : **+11%** de productivité sur le département sales ; 2 pilotes implémentés en **5 semaines** · citation : à recueillir

### Skyforce — x2 capacité de prospection
*Réf : audit-ia-skyforce-automatisation-prospection-b2b*
- **secteur** : cybersécurité (TPE/PME, Belgique — Cyberbox, NAS, Skylock) · **cas-usage** : audit IA prospection B2B (3 automatisations)
- **En une phrase** : la croissance de Skyforce dépend d'une prospection régulière, mais l'équipe se heurtait aux tâches chronophages (listes, enrichissement, relances) ; Prismia a cadré 3 automatisations prioritaires pour gagner du temps et stabiliser la perf commerciale.
- **Contexte** : acteur de la cybersécurité pour TPE/PME en Belgique, offre « packagée » (Cyberbox, NAS, Skylock). Enjeu : sensibiliser et convertir des entreprises qui n'ont pas toujours de référent IT, avec une approche commerciale très structurée.
- **Douleurs** : prospection freinée par des **étapes manuelles** (recherche d'entreprises, vérification, enrichissement, préparation d'appels) → performance irrégulière et risque d'usure sur le long terme.
- **Ce qui a été fait (Prismia)** — réduire le temps « hors vente » et rendre la prospection plus régulière sans complexifier la vie de l'équipe ; 3 leviers simples, mesurables et adoptables :
  - **Cartographie du workflow commercial** (de la cible → à l'appel → à la relance)
  - Définition des **critères de listes** (ICP, signaux, filtres, exclusions)
  - **Pipeline « listes → enrichissement → scoring → séquences »**
  - **Kit d'assistance à l'appel** (brief auto, objections, relances, compte-rendu)
- **Résultat** : **x2** — capacité de prospection potentiellement doublée à effort constant · citation : à recueillir

### OVB — +16% performance commerciale
*Réf : audit-ia-ovb-automatisation-commerciale*
- **secteur** : conseil financier / patrimoine (prévoyance, assurance, gestion patrimoniale, France) · **cas-usage** : audit IA performance commerciale (4 solutions)
- **En une phrase** : chez OVB, la croissance dépend autant du terrain que de la rigueur managériale (recrutement, suivi, coaching) ; Prismia a identifié 4 cas d'usage prioritaires, avec un potentiel chiffré et une feuille de route claire.
- **Contexte** : accompagne particuliers et familles sur des sujets financiers (prévoyance, assurance, gestion patrimoniale). En France, l'activité repose sur un réseau de conseillers et sur la capacité des managers à recruter, piloter et faire monter en compétence les équipes, avec une exécution commerciale régulière.
- **Douleurs** : un quotidien freiné par des tâches répétitives et peu « valeur » : sourcing de nouveaux talents, suivi des actions, reporting manuel, et **absence d'un playbook unique et vivant**.
- **Ce qui a été fait (Prismia)** — réduire le « travail invisible » et redonner aux managers des outils simples pour piloter (recruter, coacher, suivre) ; des cas d'usage IA mesurables, priorisés, adoptables :
  - **Process mapping complet** (sourcing → exécution → coaching → reporting)
  - Définition des **KPIs utiles** (qualité, volume, constance, taux de suivi)
  - Cadrage de **4 solutions IA/automatisation** + business case par solution
  - **Roadmap par lots** (quick wins, intégrations, conduite du changement)
- **Résultat** : **+16%** de croissance commerciale estimée (an 1), via 4 solutions (sourcing, playbook, reporting, analyse d'actions) · citation : à recueillir

### Mademoiselle Violette — x21 automatisations (admin événementiel)
*Réf : audit-ia-mademoiselle-violette-automatisation-evenementiel*
- **secteur** : événementiel / bien-être & beauté (100+ villes, grand public + QVT entreprises) · **cas-usage** : audit IA automatisation administrative de bout en bout
- **En une phrase** : l'organisation d'événements implique une multitude de micro-tâches (inscriptions, confirmations, partenaires, supports, relances) ; Prismia a mené un audit IA pour réduire la charge administrative et fiabiliser l'exécution, sans alourdir l'équipe.
- **Contexte** : conçoit et opère des expériences bien-être & beauté dans plus de 100 villes, pour le grand public et les entreprises (QVT). L'équipe gère des volumes d'événements, de participantes et de partenaires, avec un niveau de qualité constant et une logistique très cadencée.
- **Douleurs** : quand l'activité grandit, l'**administratif devient un goulot** — on passe du temps à « faire tourner la machine » au lieu d'améliorer l'expérience : copier-coller (emails, confirmations, relances, fichiers), manque de traçabilité, coordination multi-acteurs chronophage.
- **Ce qui a été fait (Prismia)** — moins de tâches manuelles, plus de fiabilité, expérience participante plus fluide ; chaque automatisation cadrée, chiffrable et planifiée :
  - **Cartographie détaillée des flux** (inscription → confirmation → coordination → suivi → bilan)
  - **Identification des tâches répétitives** et points de rupture (relances, erreurs, oublis)
  - **Business case par automatisation** (gain, risque, dépendances, adoption)
  - **Roadmap en lots** + recommandations d'outils IA/automatisation adaptés
- **Résultat** : **x21** — 21 automatisations IA priorisées pour automatiser l'admin « de A à Z » · citation : à recueillir

### Daylindo — x2 (audit Sales + RAG produit)
*Réf : audit-ia-daylindo-automatisation-sales-rag-saas*
- **secteur** : SaaS (formation / compétences, B2B) · **cas-usage** : audit IA — autonomie sales + RAG produit
- **En une phrase** : Daylindo voulait reprendre la main sur sa lead gen (sans agence) et identifier les meilleurs leviers IA côté produit ; Prismia a bâti une roadmap claire : automatisations Sales + amélioration du SaaS via un RAG.
- **Contexte** : éditeur SaaS (plateforme web + application) orienté terrain (suivi des compétences, transmission des savoir-faire, montée en autonomie). Opère sur un marché B2B (formation / compétences).
- **Douleurs** : croissance commerciale freinée par une **dépendance à l'externe** (listes, enrichissement, campagnes) ; volonté de structurer une approche plus industrielle et de rendre le SaaS plus « assistanté » via une recherche augmentée dans la doc et les contenus internes.
- **Ce qui a été fait (Prismia)** — réduire les tâches manuelles, sécuriser la qualité des leads, donner une trajectoire produit claire (choisir les leviers qui font gagner du temps) :
  - **Cartographie des étapes Sales** (listes → enrichissement → séquences → suivi) + points de friction
  - **Sélection des meilleurs outils IA/automatisation** + règles de qualité (données, messages, cadence)
  - **Cadrage du chantier RAG** : sources, gouvernance, traçabilité, critères d'adoption
  - **Roadmap priorisée avec KPIs** (productivité, volume traité, taux de réponse, temps de traitement)
- **Résultat** : **x2** — 2 chantiers IA priorisés et cadrés (autonomie commerciale + RAG produit) · citation : à recueillir

### Anestheasy — +3 projets IA (MedTech)
*Réf : audit-ia-medtech-anestheasy*
- **secteur** : MedTech (prise en charge pré-opératoire : questionnaire patient, téléconsultation, coordination) · **cas-usage** : audit IA (croissance + ops + produit)
- **En une phrase** : en 2 semaines, Anestheasy a clarifié où l'IA crée le plus d'impact (croissance, ops, produit) et obtenu une roadmap concrète, priorisée et actionnable.
- **Contexte** : MedTech qui digitalise la prise en charge pré-opératoire (questionnaire patient, téléconsultation, coordination). Enjeu : accélérer la croissance tout en gardant une exécution produit fluide et une qualité de service irréprochable.
- **Douleurs** : avec une équipe concentrée sur le produit et le terrain, il fallait **éviter les « idées IA » non prioritaires** et trancher vite : où l'IA et l'automatisation créent un vrai avantage concurrentiel sans alourdir l'opérationnel.
- **Ce qui a été fait (Prismia)** — audit orienté « problème → impact → plan d'exécution » : identifier les leviers qui augmentent la performance commerciale et la qualité opérationnelle, puis une feuille de route réaliste :
  - **Process mapping complet** (du besoin au résultat) pour repérer les goulots d'étranglement
  - **Identification de cas d'usage IA/automatisation** (agents IA = assistants qui exécutent)
  - **Business cases** : ROI, faisabilité technique, délai, impacts opérationnels
  - **Roadmap de déploiement** : pilotes, critères de succès, étapes d'industrialisation
- **Résultat** : **+3 projets** pilotes priorisés (ROI / faisabilité / délai) + plan de déploiement sur 6–12 mois · citation : à recueillir

### Dejeond – Delarge — +3 leviers IA (marchés publics)
*Réf : audit-ia-marches-publics-dejeond-delarge*
- **secteur** : ferronnerie d'art / menuiserie acier (marchés publics & privés, Liège) · **cas-usage** : audit IA réponse aux appels d'offre + capture de connaissance (RAG)
- **En une phrase** : Dejeond – Delarge voulait pérenniser la connaissance interne et stabiliser ses revenus, sans dépendre de quelques personnes clés pour répondre aux appels d'offres ; en 2 semaines, Prismia a livré une roadmap IA priorisée et un plan d'exécution.
- **Contexte** : ferronnerie d'art basée à Liège, spécialisée dans la menuiserie acier, l'habillage de façades et des projets techniques pour des acteurs publics et privés. Beaucoup d'expertise métier, des dossiers complexes, et une valeur qui se joue aussi dans la capacité à répondre vite et bien à des consultations (marchés publics / appels d'offres).
- **Douleurs** : les réponses aux appels d'offres mobilisent fortement l'**expertise interne** (technique, références, conformité, chiffrage). Risque : perdre du temps, dépendre de quelques personnes, rendre le process difficile à reproduire quand l'équipe grandit.
- **Ce qui a été fait (Prismia)** — réduire la dépendance à l'expertise tacite, gagner du temps sur les tâches répétitives, fiabiliser les réponses sans dégrader la qualité :
  - **Process mapping détaillé des réponses AO** (documents, rôles, délais, validations)
  - **Identification de cas d'usage IA/automatisation** (agent IA = assistant qui exécute)
  - **Business cases** : ROI, faisabilité technique, temporalité, impacts opérationnels
  - **Roadmap de déploiement** : pilotes, critères de succès, gouvernance et adoption
- **Résultat** : **+3 leviers IA** prioritaires pour réduire le risque « connaissance » et accélérer la réponse aux marchés publics (roadmap 6–12 mois) · citation : à recueillir
- *Cas proche : réponse aux appels d'offres + capture de connaissance.*

---

## Cas génériques — templates réutilisables (anonymisés)
> Construits depuis des propositions **déjà signées** (Amarile pour le support, Delmon Group pour
> la qualité). À remplacer par un cas nominatif dès qu'un déploiement réel est terminé.

### Agent IA Support Client (générique) — ~180 h/an libérées, ROI < 1 an
*Réf : agent-ia-support-client-rag-email*
- **secteur** : générique — toute activité avec support email (PME/ETI) · **cas-usage** : agent IA RAG sur l'historique email, brouillons de réponse (human-in-the-loop)
- **En une phrase** : un assistant IA qui transforme l'historique support en base de connaissances vivante et génère automatiquement des brouillons de réponse pré-rédigés, validés par les collaborateurs avant envoi.
- **Contexte** : les entreprises avec une activité support email accumulent un historique riche (centaines à milliers d'échanges) — source de connaissance précieuse mais enfermée dans des boîtes mail individuelles, non structurée. Plus l'équipe grandit, plus les nouveaux reformulent des réponses déjà traitées cent fois ; le départ d'un expert fait peser un risque sur la continuité.
- **Douleurs** : connaissance enfermée dans les boîtes mail (perdue au turnover) ; temps expert consommé par des réponses répétitives ; risque d'**incohérence** selon le collaborateur ; volumétrie typique ~10 tickets/jour, ~5 min économisables/traitement → **~180 h/an** perdues en rédaction redondante.
- **Ce qui a été fait (Prismia)** — architecture modulaire en 3 briques, intégrée à l'email existant (OVH / Google Workspace / Microsoft 365) sans changer les outils :
  - **Module 0 — Infra LLM sécurisée** : environnement souverain, 2 options d'hébergement (local open source **ou** API européenne no-data-retention type Mistral), changement de modèle simplifié
  - **Module 1 — Base de connaissances** : extraction IMAP, structuration en triplets Problème/Solution/Module, dédoublonnage, indexation sémantique (base vectorielle)
  - **Module 2 — RAG Support** : brouillon de réponse contextualisé déposé dans les Drafts ; validation humaine avant envoi (**jamais d'envoi automatique**)
  - **Méthodologie 4 phases** (6 semaines) : Cadrage & Infra → Base de connaissances (S1-2) → Moteur RAG (S3-4) → Validation & mise en production (S5-6)
- **Résultat** : **~180 h/an** libérées (~7 200 €/an, base 40 €/h) → **ROI < 1 an** ; fin de la perte de connaissance au turnover ; temps réalloué vers R&D / bugs complexes / veille · citation : à recueillir (après mise en production)

### Agent IA Qualité — Veille CSR/CGA/Normes (générique) — 100% des modifs détectées
*Réf : agent-ia-qualite-veille-csr-rag*
- **secteur** : industrie multi-sites (exigences clients fortes, secret industriel) · **cas-usage** : agent de veille documentaire (portails clients) + dispatch ciblé + RAG qualité
- **En une phrase** : un agent IA qui surveille en continu les portails clients pour détecter les modifications de CSR, CGA et normes, notifie les bons interlocuteurs par usine, et offre un RAG de recherche documentaire en langage naturel.
- **Contexte** : les groupes industriels multi-sites font face à un enjeu critique de conformité — gestion des Exigences Spécifiques Clients (CSR), des Conditions Générales d'Achat (CGA) et des normes, mises à disposition via les portails de chaque donneur d'ordre. Une modification documentaire passée inaperçue = écarts de production immédiats, aux conséquences financières et contractuelles lourdes.
- **Douleurs** : risque de **non-conformité critique** (modif non détectée) ; veille manuelle chronophage et faillible sur plusieurs portails ; routage lent vers le bon interlocuteur (Qualité / R&D / Logistique) selon l'usine ; recherche documentaire chronophage ; contraintes de souveraineté et de secret industriel.
- **Ce qui a été fait (Prismia)** — architecture modulaire en 3 briques, **No-Data-Retention** sur toute la chaîne :
  - **Module 0 — Socle sécurité & infra** : environnement maîtrisé, 2 options (souveraineté totale en local **ou** API européenne Zero-Data-Retention), accès réseau sécurisés et protocoles chiffrés
  - **Module 1 — « La Vigie »** : agents de navigation automatisés (récupération PDF/Word), **comparateur de versions** (détection d'écarts), **moteur de dispatch ciblé** par usine (Qualité/R&D/Logistique), stockage versionné + métadonnées complètes
  - **Module 2 — RAG Qualité** : interrogation en langage naturel du capital documentaire, **sourçage systématique** vers le document d'origine, niveau de technicité adapté au profil (opérateur, technicien, responsable)
  - **Méthodologie 4 phases** (8 semaines) : Data Readiness & Cadrage → Infra & Socle (S1-2) → « La Vigie » (S3-5) → Intégration RAG & Déploiement (S6-8)
- **Résultat** : **100%** des modifications CSR/CGA/normes détectées automatiquement ; délai de réaction de plusieurs jours/semaines → quelques heures (routage ciblé par métier/usine) ; souveraineté garantie · citation : à recueillir (après mise en production)

---

## Cas additionnels (portfolio fiche BDR — anonymisés ou nominatifs)
> Issus de `prismia_bdr_v3.pdf`. Détail « solution » plus succinct que ci-dessus.

### Courtier grossiste (anonymisé) — x4,5 capacité de traitement
- **secteur** : assurance / courtage (grossiste) · **cas-usage** : automatisation IA des workflows + intégration ERP/CRM
- **Ce qui a été fait** : automatisation du traitement de dossiers, intégration directe aux outils existants (ERP, CRM) · **Résultat** : **x4,5** sans augmentation des effectifs · citation : à recueillir

### Horeco Travel — +30 opportunités commerciales / mois
- **secteur** : voyage & MICE (cible institutionnelle : ASBL, ONG, collectivités bruxelloises) · **cas-usage** : système d'acquisition IA
- **Ce qui a été fait** : extraction + segmentation des prospects pertinents, enrichissement via agent IA (emails/LinkedIn/sites), scoring & personnalisation à grande échelle · **Résultat** : **30+** opportunités qualifiées/mois (système autonome) · citation : à recueillir

### Moja Agency — flux mensuel de leads qualifiés
- **secteur** : communication / agence (cible ONG européennes à budget significatif) · **cas-usage** : prospection IA
- **Ce qui a été fait** : segmentation IA (affinité valeurs, taille, implication récente) + qualification auto + perso email/LinkedIn selon contexte & actualité · **Résultat** : **flux mensuel** de leads qualifiés, taux de réponse nettement supérieur · citation : à recueillir

### Laboratoire pharmaceutique (anonymisé) — −99% temps d'analyse
- **secteur** : pharma / R&D (analyse industrielle) · **cas-usage** : automatisation de l'analyse chromatographique par IA
- **Ce qui a été fait** : traitement automatisé des courbes + extraction des résultats significatifs · **Résultat** : analyse de **~2 semaines à ~2 heures** (−99%) · citation : à recueillir

### Usine agroalimentaire (anonymisé) — +8% productivité production
- **secteur** : agroalimentaire / production industrielle · **cas-usage** : optimisation IA de l'ordonnancement & du planning
- **Ce qui a été fait** : système d'optimisation intégrant contraintes et variables terrain (réduction de « l'effet de vague ») · **Résultat** : **+8%** de productivité sur le site · citation : à recueillir

### Réseau 750 restaurants (anonymisé) — 97% de précision de prévision
- **secteur** : restauration (réseau multi-sites) · **cas-usage** : modèle ML de prévision du chiffre d'affaires
- **Ce qui a été fait** : modèle prédisant le CA à 10 jours par tranche de 15 min et par canal, pour 750 restaurants simultanément · **Résultat** : **97%** de réussite ; stocks & RH optimisés · citation : à recueillir
