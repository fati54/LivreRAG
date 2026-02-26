# Chapitre 8 : Sécurité, gouvernance et souveraineté


## 8.1 Introduction : pourquoi la sécurité n’est pas un “bonus”

Un pipeline RAG n’est pas un gadget de hackathon.  
Il sera utilisé pour des **données sensibles**, des **décisions critiques**, des **contextes réglementés** (santé, finance, droit, éducation).  

La sécurité et la gouvernance ne sont donc pas des add-ons, mais des **éléments constitutifs** du pipeline.  

Or, la plupart des frameworks actuels (LangChain, LlamaIndex, etc.) traitent la sécurité **après coup**, comme une couche externe. Résultat :  
- fuites de données internes,  
- hallucinations dangereuses,  
- absence de traçabilité.  

---

## 8.2 Les PII (données personnelles)

Un pipeline RAG mal conçu peut aspirer des **données personnelles identifiables (PII)** lors de l'ingestion, les stocker dans l'index vectoriel, les récupérer lors du retrieval, et les ré-exposer dans la réponse générée, parfois sans que l'utilisateur final s'en rende compte.

### Exemples concrets de PII qui posent problème

- Nom, prénom, adresse email ou postale apparaissant dans un log d'activité ou un email interne.
- Numéro de sécurité sociale, carte bancaire ou numéro de téléphone dans un rapport RH ou financier.
- Données médicales (symptômes, diagnostics, traitements) dans un dossier patient ou un compte-rendu hospitalier.
- Combinaisons subtiles : âge, commune, profession et quelques mots-clés constituent des **quasi-identifiants** qui permettent de ré-identifier une personne même sans nom explicite.

### Risques associés

- **Juridiques** :
  - RGPD (Europe) : amendes jusqu'à 4 % du chiffre d'affaires mondial pour fuites de PII.
  - HIPAA (États-Unis) pour les usages santé.
  - NIS2 (cybersécurité des infrastructures critiques) et DORA (résilience financière).
  - **EU AI Act** pour les systèmes à haut risque (santé, emploi, droit, finance) : exigences strictes de gouvernance des données (jeux de données représentatifs, complets, sans erreurs, conformément à l'article 10), traçabilité, journaux inviolables, gestion des risques.
  - **Cyber Resilience Act (CRA)** : pour les produits numériques et connectés (ex. logiciel avec caméra d'eye-tracking). Obligation de signalement des vulnérabilités exploitées et des incidents à partir du 11 septembre 2026. Mises à jour de sécurité garanties pendant au moins 5 ans. Marquage CE obligatoire (plein effet en décembre 2027).
  - **Data Act** (depuis 2025) : portabilité obligatoire des données générées (ex. données de fatigue issues d'un eye-tracking), permettant le transfert vers un concurrent sans verrouillage propriétaire.
  - **Loi 25 (Québec/Canada)** : pour tout service avec utilisateurs québécois, nomination d'un DPO obligatoire, signalement de toute fuite (même mineure), amendes pouvant atteindre 25 millions CAD.
  - **Product Liability Directive (PLD 2024/2853)** : remplace l'ancienne directive sur la responsabilité du fait des produits défectueux. Établit une responsabilité stricte pour les produits logiciels et d'IA, avec une charge de preuve allégée pour les victimes (ex. accident causé par un faux négatif sur un système de détection de fatigue).

- **Réputationnels** :
  - Scandales médiatiques rapides : une fuite de PII via un RAG peut générer un bad buzz sur les réseaux sociaux ou dans la presse.
  - Perte de confiance des clients, partenaires et investisseurs, particulièrement dans les secteurs sensibles comme la santé ou les transports où la sécurité est critique.
  - Boycotts ou interdictions internes, à l'image de Samsung interdisant ChatGPT en 2023 après des fuites de code.

- **Opérationnels** :
  - Audits internes bloquants par les DPO ou CISO, entraînant des délais ou une interdiction de déploiement.
  - Coûts élevés de mise en conformité : rédaction PII multi-couches, mise en place de garde-fous, journalisation, audits requis par l'EU AI Act.
  - Retards sur le marché européen : un produit non conforme au CRA ne peut pas être vendu ; un système à haut risque non conforme à l'AI Act est bloqué.
  - Risques techniques : l'obligation de signalement des incidents auprès de l'ENISA (CRA) peut surcharger les équipes.

- **Financiers et stratégiques** :
  - Cumul possible d'amendes (RGPD, AI Act, CRA, PLD) avec un impact business majeur.
  - Perte d'opportunités sur le marché européen, où la souveraineté et la conformité sont des prérequis pour les secteurs publics, la santé et la finance.

### Solutions de base (approche 2023-2024, toujours valable pour démarrer)

Mise en place d'un filtrage PII intégré **en amont et en aval** du pipeline :

- **Amont** : nettoyage dès l'ingestion, avant le chunking et l'indexation.
- **Aval** : scan systématique de la réponse générée avant son envoi à l'utilisateur.

Outils open-source classiques et efficaces :

- **Microsoft Presidio** : détection par NER, expressions régulières et motifs personnalisés. Gratuit et facile à intégrer.
- **spaCy NER** associé à des règles regex et un petit modèle critique (critic-LLM) pour valider les détections douteuses.

Cette approche est suffisante pour des prototypes ou des usages non réglementés, et reste la base de nombreux pipelines en production légère.

### Évolution vers l'état de l'art : stratégie multi-couches (defense in depth)

Les fuites via RAG (chunks non nettoyés, quasi-identifiants, récupération de contenu sensible) sont maintenant mieux documentées, et les régulateurs (notamment l'EU AI Act pour les systèmes à haut risque) exigent une protection **tout au long du pipeline**, et non pas seulement en entrée et sortie.

Stratégie recommandée pour les entreprises (francophones, européennes ou africaines) :

1.  **Lors de l'ingestion** : application systématique d'une rédaction ou d'un masquage (Presidio reste pertinent, mais doit être complété par des outils contextuels).
2.  **Étiquetage au niveau des chunks** : ajout de métadonnées comme `pii_level: high / medium / none` ou `contains_phi: true` pour permettre un filtrage granulaire.
3.  **Lors du retrieval** : filtrage dynamique basé sur le rôle de l'utilisateur (RBAC combiné à un filtre sur les métadonnées). Les chunks sensibles sont exclus pour certains utilisateurs.
4.  **Lors de la génération** : scan de la sortie avec des garde-fous programmables.
5.  **Post-génération** : double vérification par des règles strictes ou un petit modèle local (par exemple, pour détecter les quasi-identifiants).

Outils les plus déployés actuellement :

- **Protecto.ai** : outil contextuel avec un rappel supérieur à 99 % sur les PII, PHI, PCI et quasi-identifiants. Son masquage préserve plus de 85 % de la similarité cosine (n'altère pas le raisonnement du LLM). Multilingue (50+ langues), très performant pour les architectures RAG et l'IA agentique.
- **AWS Bedrock Guardrails** : propose la rédaction de PII, la détection de toxicité et des filtres contextuels.
- **NVIDIA NeMo Guardrails** : permet de masquer ou rejeter les chunks sensibles avant leur passage dans le prompt (retrieval rails). La détection et le masquage des PII sont intégrés. Solution multilingue et programmable (langage Colang), excellente pour le grounding du RAG et la protection de la vie privée.

| Niveau de maturité | Approche PII | Outils typiques | Quand l'utiliser ? |
| :--- | :--- | :--- | :--- |
| **Base / Prototype** | Scan à l'ingestion et scan en sortie | Presidio, spaCy NER + regex | Quick start, contextes non réglementés |
| **Enterprise** | 5 couches + étiquetage + ACL au retrieval | Protecto.ai, Bedrock/NeMo Guardrails | Santé, finance, droit, administrations publiques |
| **Souverain / local** | Auto-hébergé + open-source renforcé | Presidio + NeMo en local | Environnements air-gapped, souveraineté maximale |

## 8.3 Le droit à l’oubli (Right to Erasure – Art. 17 RGPD)

Une fois un document ingéré, chunké et indexé dans un vector store, il devient **rarement supprimable**.  
Les chunks sont dispersés, les embeddings "mélangés" sémantiquement, et dans un RAG naïf, supprimer un fichier source ne garantit pas l'oubli total (le retrieval peut encore ramener des résidus via similarité).

Pourtant, un pipeline RAG **responsable et conforme** doit impérativement permettre la **purge sélective**.  
C'est un pilier de la **souveraineté documentaire** : l'utilisateur (ou le DPO) doit pouvoir exercer son **droit à l’oubli** (RGPD Art. 17) sans délai injustifié, y compris pour des données personnelles ou sensibles indexées.

### Contexte réglementaire

- **RGPD Art. 17** : droit à l’effacement « sans retard injustifié » si les données ne sont plus nécessaires, le consentement est retiré, ou en cas d’objection légitime (exceptions limitées : obligation légale, intérêt public, recherche scientifique).

- **EDPB CEF 2025-2026** : action coordonnée sur le *right to erasure*. Trente-deux autorités ont scruté les pratiques et identifié des défis récurrents :
  - absence de procédures internes claires,
  - anonymisation inefficace comme substitut à la suppression,
  - problèmes de persistance dans les backups,
  - rétention non définie.

- **EU AI Act (systèmes à haut risque)** : pour les systèmes high-risk (santé, emploi, droit, finance), la traçabilité est obligatoire (logs, datasets) mais **ne dispense pas** du RGPD : les données personnelles doivent rester effaçables, sans rétention éternelle.

- **Défis spécifiques aux architectures RAG/IA** :
  - Les **embeddings** peuvent permettre une reconstruction partielle (attaques par inversion).
  - Les **modèles fine‑tunés** retiennent l’information dans leurs poids. Un véritable effacement est quasi impossible sans *machine unlearning*, technique encore coûteuse et non mature en actuellement(2026).
  - Pour une architecture RAG *retrieval‑only*, la suppression est réalisable : il suffit d’effacer les chunks concernés pour que la source ne soit plus restituée.
---

## 8.4 Cloisonnement des données : multi‑tenancy et isolation

Un pipeline RAG qui ne met pas en œuvre de cloisonnement explicite expose les données à des risques de fuites croisées. Dans une architecture naïve, l’ensemble des sources (internes, externes, publiques, privées) et surtout les données de multiples clients ou unités d’affaires sont ingérées dans un même index vectoriel. Cette promiscuité sémantique permet à un utilisateur, volontairement ou non, de récupérer des fragments d’information appartenant à un autre tenant, par simple similarité de requête.


En 2023, Samsung a interdit l’usage de ChatGPT après que des ingénieurs eurent involontairement transféré du code source sensible (optimisations, détails matériels, comptes rendus de réunions) vers les serveurs d’OpenAI. Ces données, une fois stockées, échappent à tout contrôle : impossible de les supprimer, risque de réutilisation pour l’entraînement ou de divulgation indirecte.

Transposé à un environnement RAG partagé , le même mécanisme de fuite peut se produire : un chunk sensible d’un tenant peut être rappelé par une requête sémantiquement proche émanant d’un autre tenant, si l’index n’est pas strictement cloisonné.

### Conséquences juridiques, réputationnelles et techniques

- **Juridiques** :  
  - Violation du RGPD (articles 5 – minimisation, 32 – sécurité).  
  - Non‑conformité à l’EU AI Act pour les systèmes à haut risque (gouvernance des données défaillante).  
  - Cumul possible d’amendes avec NIS2 et CRA (si le produit est un logiciel connecté).

- **Réputationnelles** :  
  - Perte de confiance des clients, en particulier dans les secteurs sensibles (santé, finance, droit).  
  - Refus d’adopter une solution SaaS RAG sans preuve d’isolation.

- **Techniques et opérationnelles** :  
  - Vulnérabilité aux attaques adversariales (requêtes construites pour exfiltrer des chunks d’autres tenants).  
  - Surcharge des audits internes et des contrôles de conformité.

### Principes de conception pour un cloisonnement robuste

L’objectif est de garantir qu’aucune donnée d’un tenant ne puisse être accessible par un autre. Plusieurs stratégies, combinables, sont déployées selon le niveau d’isolation recherché et les contraintes d’exploitation.

#### Isolation physique par namespaces

Un **namespace** est une partition physique au sein de l’index vectoriel. Chaque tenant possède son propre namespace ; toutes les opérations d’indexation et d’interrogation sont limitées à cet espace.

- **Avantages** :  
  - Isolation totale, aucune fuite possible par similarité.  
  - Scaling indépendant : la charge d’un tenant n’affecte pas les performances des autres.  
  - Optimisation des requêtes (réduction de l’espace de recherche).

- **Inconvénients** :  
  - Consommation de ressources potentiellement plus élevée.  
  - Gestion administrative des namespaces (création, suppression).

#### Isolation logique par filtrage de métadonnées et contrôle d’accès

Chaque chunk est étiqueté avec des métadonnées (ex. `tenant_id`, `niveau_de_confidentialité`). Lors de la phase de *retrieval*, un filtre est systématiquement appliqué pour n’autoriser que les chunks dont les métadonnées correspondent aux droits de l’utilisateur.

- **Mise en œuvre** :  
  - Enrichissement des chunks lors de l’ingestion : `tenant_id = uuid_tenant`, `access_level = public | restreint | confidentiel`.  
  - Au moment de la requête, extraction de l’identité du tenant (via JWT/OIDC) et ajout d’un filtre `tenant_id == current_tenant`.

- **Avantages** :  
  - Un index unique, économique et simple à maintenir.  
  - Flexibilité : possibilité d’affiner les droits par chunk (RBAC granulaire).

- **Inconvénients** :  
  - La performance dépend de l’efficacité du moteur de filtrage de la base vectorielle.  
  - Risque d’erreur de configuration (oubli du filtre) – d’où l’importance d’une architecture Zero Trust.

#### Politiques d’accès : RBAC et Zero Trust

Au‑delà du cloisonnement technique, une politique d’accès stricte doit encadrer chaque requête :

- **RBAC (Role‑Based Access Control)** : chaque utilisateur se voit attribuer un rôle (admin, viewer, editor) dans le contexte d’un tenant. Les autorisations sont vérifiées avant toute opération.
- **Zero Trust** : l’identité et l’autorisation sont contrôlées à chaque étape : authentification par JWT/OIDC, vérification RBAC, application du filtre de tenant. Aucune requête n’est traitée sans ces contrôles.

#### Autres patterns d’isolation

- **Collections séparées** : affecter une collection par tenant (ou par groupe). Lourdeur administrative mais isolation maximale.
- **Index par tenant** : chaque tenant dispose de son propre index physique. Idéal pour la souveraineté, mais coûteux en ressources et en synchronisation.

### Support du multi‑tenancy dans les bases vectorielles

Le tableau ci‑dessous compare les capacités d’isolation des principales bases vectorielles utilisées dans les architectures RAG.

| Base vectorielle | Mécanisme d’isolation principal | Limites / particularités | Cas d’usage recommandé |
|-------------------|----------------------------------|--------------------------|-------------------------|
| **Pinecone**      | Namespaces (jusqu’à 100 000+ sur plans standard) | 20 indexes max par projet ; namespaces physiques | SaaS multi‑clients, isolation forte, scaling indépendant |
| **Weaviate**      | Multi‑tenancy natif (tenants/classes) + filtrage métadonnées | Excellent passage à l’échelle ; compatible RBAC | Hybrid search, besoin de filtrage avancé, self‑hosted souverain |
| **Qdrant**        | Filtrage sur payload JSON + collections + partitions | Pas de limite stricte de namespaces ; filtrage très performant | Applications avec filtres complexes, open‑source, retrieval ACL |
| **Milvus**        | Collections, partitions, filtres scalaires | Adapté aux très gros volumes distribués | Projets massifs, environnements air‑gapped, souveraineté |
| **Chroma**        | Collections simples + filtres métadonnées | Moins mature pour la production à grande échelle | Prototypes, petites charges, multi‑tenancy simple |


### Schéma fonctionnel d’un pipeline cloisonné

```
[Authentification] → JWT / OIDC
         ↓
[Contrôle RBAC] → extraction du rôle et du tenant_id
         ↓
[Construction de la requête vectorielle] 
   + filtre systématique : tenant_id == current_tenant
         ↓
[Exécution du retrieval] → uniquement chunks du namespace / filtrés
         ↓
[Génération de la réponse] (LLM)
         ↓
[Gouverneur de risque] → validation finale (PII, hallucination, etc.)
         ↓
[Envoi de la réponse à l’utilisateur]
```

Ce flux garantit que chaque étape respecte le cloisonnement : l’authentification établit l’identité, le RBAC détermine les droits, le filtrage restreint l’accès aux seuls chunks autorisés, et le gouverneur de risque apporte une ultime vérification.

---

## 8.5 Le gouverneur de risque

Innovation clé : un **module transversal** qui intercepte la sortie du LLM avant exposition à l’utilisateur. Il agit comme contrôleur final intelligent, programmable et auditable, transformant un RAG créatif en système fiable pour usages critiques.

### Rôle principal
- **Détecter** les violations : PII résiduel, hallucinations (réponses non ancrées dans les chunks), jailbreak, toxicité, non-respect des règles métier.
- **Appliquer des politiques** : bloquer, reformuler (ex. ajouter un disclaimer), masquer des parties sensibles, escalader (alerte humaine), journaliser.
- **Assurer la fidélité (faithfulness)** : vérifier que la réponse est bien fondée sur les chunks récupérés.

### Flux typique

```text
[Requête utilisateur] → [Retrieval cloisonné (cf. 8.4 : isolation par tenant)] → [Prompt contrôlé] → [Génération LLM] 
  → [Gouverneur de risque] → [Réponse validée/bloquée/reformulée] → [Utilisateur]
```

### Exemples 
- **Santé** : bloquer toute recommandation hors guidelines officielles ; **reformuler en « consultez un médecin »**.
- **Droit** : empêcher la citation d’une jurisprudence inventée ; exiger une source exacte.
- **Industrie** : filtrer toute fuite de secret industriel ou IP.
- **Finance/RH** : détecter et rédacter les PII résiduels ; interdire les conseils financiers non qualifiés.

### Défis spécifiques RAG
- Hallucinations persistantes même avec retrieval.
- Jailbreak via injection contextuelle (chunks malveillants).
- PII qui survivent malgré le filtrage amont (quasi-identifiants).
- Exigence de faible latence (< 500 ms).
- Traçabilité et logs conformes à l’EU AI Act.

Le gouverneur de risque est la **barrière finale** qui transforme un prototype RAG en système critique de confiance (santé, droit, industrie, etc.). Sans lui, hallucinations, fuites et non‑conformité deviennent inévitables. Avec les bons outils, on obtient des réponses auditées, fiables et sécurisées – même en production multi‑tenant.

---
## 8.6 La souveraineté comme enjeu stratégique

Où tourne le pipeline ? Qui contrôle les données, les modèles, les décisions ?  
La souveraineté n’est pas une option technique, c’est un **prérequis de confiance** pour les secteurs sensibles (santé, droit, finance, défense).

### Pourquoi la souveraineté est cruciale 

- **Cloud Act (US)** : tout fournisseur américain (même avec serveurs en Europe) peut être contraint de transmettre des données aux autorités US.  
- **EU AI Act (high-risk)** : exigences de traçabilité et de contrôle poussent à réduire les dépendances externes.  
- **Risques géopolitiques** : une API externe bloquée interrompt tout le pipeline.

### Options d’hébergement – comparatif

| Option                         | Avantages                                    | Inconvénients                             | Cas d’usage typique          | Exemples                   |
|--------------------------------|----------------------------------------------|--------------------------------------------|------------------------------|--------------------------------|
| **Cloud public US**            | Performance, services IA avancés             | Cloud Act, non conforme high-risk seul    | Prototypes, tests rapides    | OpenAI, Google Cloud           |
| **Cloud souverain européen**   | Conforme RGPD/EU AI Act, données en UE       | Coût plus élevé, latence                   | Administrations, santé, finance | OVHcloud, Scaleway, AWS Sovereign |
| **Hybride (local + fallback)** | Maîtrise par défaut, recours externe ponctuel | Complexité d’orchestration                 | Entreprises exigeantes        | Mistral self‑hosted + OVH API  |
| **On‑prem / air‑gapped**       | Contrôle absolu, sécurité maximale           | Investissement lourd, maintenance          | Défense, secrets industriels | Mistral / Llama.cpp sur site   |

### En pratique

- **Mistral AI** (français) : modèles ouverts auto‑hébergés, infrastructure souveraine (Essonne, Suède).  
- **AWS European Sovereign Cloud**  : région Allemagne, isolée des US, services IA inclus.  
- **OVHcloud / Scaleway** : data centers en Europe et Afrique de l’Ouest, adaptés aux pays francophones.

### Arbre décisionnel

```
[RAG en production]
  ├── Usage non réglementé → Cloud US (rapide, économique)
  └── Usage réglementé / high-risk →
      ├── Souveraineté maximale → On‑prem (Mistral self‑hosted)
      ├── Souveraineté UE → Cloud souverain (OVH, Scaleway, AWS Sovereign)
      └── Hybride → Local + fallback souverain
```

le choix de l’infrastructure détermine la maîtrise des données et la conformité. Actuellement, des solutions souveraines matures existent pour allier performance et contrôle.

---


## 8.7 Observabilité et traçabilité : la colonne vertébrale de la gouvernance

Un pipeline RAG, par nature, est une boîte noire : requête en entrée, réponse en sortie. Mais en contexte critique (santé, droit, finance), cette boîte noire doit devenir **transparente** et **auditable**.

### Ce qu'il faut tracer pour chaque réponse

- **La requête utilisateur** : texte brut, éventuellement anonymisé.
- **Les documents/chunks récupérés** : identifiants, sources, scores de similarité.
- **Les règles appliquées** : filtres PII, politiques RBAC, garde-fous déclenchés.
- **La génération** : prompt exact, modèle utilisé, température, tokens consommés.
- **Les décisions du gouverneur de risque** : réponse validée, bloquée ou reformulée.

### Pourquoi c'est crucial ?

- **EU AI Act (high-risk)** : exigence de logs « tamper-resistant » et de traçabilité complète.
- **RGPD** : prouver qu'une donnée a bien été supprimée (droit à l'oubli) ou n'a pas été utilisée.
- **Audits de conformité** : ISO 27001, SOC 2, certifications sectorielles.
- **Débogage et amélioration continue** : comprendre les échecs (hallucinations, hors-sujet).

### Alertes proactives à mettre en place

- **Fuites PII** : détection d'un motif PII en sortie (malgré filtrage amont).
- **Hallucinations fréquentes** : faithfulness score < seuil sur plusieurs réponses.
- **Coûts anormaux** : pic de tokens consommés (requête malveillante ?).
- **Dérive de performance** : latence retrieval > seuil, taux d'échec en hausse.
- **Tentatives de jailbreak** : détection de patterns d'attaque.

L'observabilité n'est pas un module isolé : elle **boucle** avec les autres composants.

- Les logs alimentent les **audits** (section 8.8).
- Les alertes PII remontent au **gouverneur de risque** (section 8.5).
- Les métriques de retrieval orientent les choix de **cloisonnement** (section 8.4).

Sans observabilité, vous naviguez à l'aveugle. Avec elle, vous pouvez :
- Prouver la conformité,
- Détecter les incidents en temps réel,
- Améliorer continuellement la qualité.

C'est bien la **colonne vertébrale** qui relie tous les autres mécanismes de gouvernance.

---

## Analyse de la section 8.8 "Auditabilité et conformité"

### Ce qui fonctionne bien

- **Les trois piliers sont pertinents** : journalisation, versioning documentaire, explicabilité couvrent l'essentiel.
- **Lien avec les certifications** : mentionner ISO 27001, SOC 2, HIPAA, RGPD ancre le propos dans le concret.
- **Cohérence avec le chapitre** : ces notions font écho aux sections précédentes (traçabilité dans 8.2, logs dans 8.5, observabilité dans 8.7).

### Ce qui manque par rapport au reste du chapitre

Comme pour la section 8.7, la version actuelle est **trop succincte**. Comparée à 8.2, 8.4 ou 8.5, elle ne développe pas suffisamment chaque point.

| Aspect | Dans 8.2, 8.4, 8.5 | Dans 8.8 (version actuelle) |
|--------|---------------------|------------------------------|
| **Structure** | Problème → risques → solutions → outils → tableau | Simple liste à puces |
| **Exemples concrets** | Par secteur (santé, droit, finance) | Aucun |
| **Outils spécifiques** | Décrits avec forces/faiblesses | Aucun |
| **Défis techniques** | Hallucinations, quasi-identifiants, latence | Non abordés |
| **Liens réglementaires** | Articles précis (RGPD Art. 17, EU AI Act Art. 10) | Mention générique |
| **Mise en œuvre pratique** | Schémas, flux, étapes | Absente |

### Proposition de reformulation

## 8.8 Auditabilité et conformité : prouver pour durer

Un pipeline RAG en production, surtout dans les secteurs réglementés, ne suffit pas à être sécurisé : il doit pouvoir **prouver** qu'il l'est. L'auditabilité est la capacité à démontrer, à tout moment, le respect des engagements de sécurité et des obligations légales.

### Les trois piliers de l'auditabilité RAG

#### Journalisation (logging) – qui a fait quoi, quand ?

Chaque interaction significative avec le système doit être enregistrée dans un journal **infalsifiable** (tamper-proof) et **horodaté**.

**Ce qui doit être journalisé :**
- Requêtes utilisateur (anonymisées si nécessaire)
- Chunks récupérés et leurs sources
- Prompt exact envoyé au LLM
- Réponse générée (avant et après passage du gouverneur de risque)
- Décisions du gouverneur (validation, blocage, reformulation)
- Actions d'administration (ingestion, modification, suppression de documents)

**Exigences réglementaires :**
- **EU AI Act (high-risk)** : logs conservés de manière à garantir leur intégrité et leur traçabilité.
- **RGPD** : prouver qu'une demande d'effacement a bien été exécutée.
- **HIPAA** : trace des accès aux données de santé.

**Outils :**
- **OpenTelemetry** + stockage sécurisé (base immutable type TimescaleDB)
- **AWS CloudTrail** / **Azure Monitor** pour environnements cloud
- **Loki** (Grafana) pour agrégation légère

#### Versioning documentaire – quelle version était en vigueur ?

Dans un contexte juridique, médical ou réglementaire, la réponse donnée aujourd'hui peut être contestée dans six mois. Il faut pouvoir reconstituer exactement **l'état du corpus** au moment de la requête.

**Mise en œuvre :**
- Chaque document/chunk possède un identifiant de version.
- L'index vectoriel référence ces versions.
- Les logs de retrieval enregistrent les versions exactes utilisées.
- Possibilité de rejouer une requête sur un état passé du corpus.

**Cas concret :** Un avocat utilise votre RAG en janvier pour préparer un dossier. En juin, une jurisprudence est modifiée. Lors d'un contrôle, vous devez prouver que la réponse de janvier était basée sur la version correcte de l'époque.

#### Explicabilité – source exacte de chaque réponse

Le LLM peut reformuler, synthétiser, réorganiser l'information. L'utilisateur (ou l'auditeur) doit pouvoir remonter à la **source brute** qui a fondé chaque affirmation.

**Techniques :**
- **Citation des chunks** : en fin de réponse, lister les documents sources (avec extraits).
- **Liens hypertextes** vers le document original (si accessible).
- **Surlignage** dans la réponse des passages directement extraits vs générés.
- **Score de confiance** par affirmation (ex. faithfulness score > 0,9).

**Outils :**
- **RAGAS** (metrics d'évaluation)
- **LlamaIndex** (gestion native des sources)
- **LangChain** (callbacks pour traçabilité)

### Certifications ou conformité à viser :

| Certification | Exigences clés pour un RAG | Comment y répondre |
|---------------|----------------------------|---------------------|
| **ISO 27001** | Contrôle d'accès, traçabilité, gestion des incidents | RBAC + logs + alertes (8.4, 8.5, 8.7) |
| **SOC 2** | Sécurité, disponibilité, confidentialité | Chiffrement, isolation, audits réguliers |
| **HIPAA** | Confidentialité données santé, audit trails | PII filtering (8.2), logs infalsifiables |
| **RGPD** | Droit à l'oubli, minimisation, traçabilité | Purge sélective (8.3), logs anonymisés |


L'auditabilité n'est pas une contrainte administrative : c'est la **preuve tangible** que votre pipeline est digne de confiance. Sans elle, une allégation de fuite ou de mauvaise pratique devient impossible à contester. Avec elle, vous pouvez :
- Répondre sereinement aux audits,
- Démontrer votre conformité aux régulateurs,
- Inspirer confiance à vos clients et partenaires.

---

## 8.9 Red teaming et tests adversariaux : se confronter à ses propres failles

Un pipeline RAG, aussi sécurisé soit-il en conception, peut présenter des vulnérabilités insoupçonnées. Le **red teaming** consiste à simuler des attaques réelles pour découvrir ces failles **avant** qu’un adversaire ne les exploite. C’est une assurance-vie pour les systèmes critiques.

### Typologies d’attaques à tester

- **Injections de prompts** : l’attaquant tente de détourner le LLM via des instructions cachées dans la requête ou via des chunks malveillants (context injection).
- **Exfiltration de données** : requêtes conçues pour forcer le modèle à révéler des chunks sensibles d’autres tenants ou des PII non filtrées.
- **Jailbreak** : contournement des garde-fous pour obtenir des réponses interdites (conseils médicaux, légaux, etc.).
- **Empoisonnement de la base** : injection de chunks toxiques ou trompeurs dans le corpus pour polluer les réponses futures.
- **Évasion du gouverneur de risque** : tests pour voir si des réponses dangereuses peuvent passer les filtres finaux.

### Méthodologie 

1. **Constituer une équipe dédiée** (ou faire appel à des prestataires spécialisés) avec un regard neuf.
2. **Définir des scénarios réalistes** basés sur la surface d’attaque du pipeline (ingestion, retrieval, génération, gouvernance).
3. **Exécuter les tests** en conditions opérationnelles, avec instrumentation poussée (logs, métriques).
4. **Analyser les résultats** : taux de réussite des attaques, failles découvertes, temps de détection.
5. **Remédier** : ajuster les filtres, renforcer les prompts, améliorer le gouverneur de risque.
6. **Répéter** : le red teaming doit être continu, pas ponctuel.

### Outils spécialisés

| Outil | Focus | Atout principal |
|-------|-------|-----------------|
| **NVIDIA NeMo Guardrails** | Détection d’injections, jailbreak | Retrieval rails + programmabilité Colang |
| **Guardrails AI** | Validation structurelle, politiques | RAIL spec, open‑source |
| **Garak** | Scanner automatique de vulnérabilités LLM | Tests en batch, nombreuses sondes |
| **PyRIT (Microsoft)** | Framework de red teaming automatisé | Scénarios paramétrables, intégration CI/CD |
| **Firewalls IA** (ex. HiddenLayer, CalypsoAI) | Protection runtime + tests adversariaux | Détection en temps réel, logs d’attaques |

### Intégration dans le cycle de vie

- **En développement** : tests unitaires adversariaux (ex. prompt injection sur un échantillon).
- **Avant mise en production** : campagne de red teaming complète.
- **En production** : surveillance continue avec détection d’anomalies (cf. observabilité 8.7) et déclenchement de tests ciblés.

Le red teaming n’est pas un luxe : c’est le seul moyen de valider que votre pipeline résiste à des adversaires déterminés. Avec la maturité des attaques sur les systèmes RAG, une campagne régulière est indispensable pour maintenir la confiance et la conformité (EU AI Act exige des mécanismes de surveillance et de gestion des risques).


---

## 8.10 Illustrations concrètes

- **Samsung (2023)** → fuite de code interne via ChatGPT → interdiction interne.  
- **Avocats US (2023)** → ChatGPT a inventé des jurisprudences inexistantes → sanctions disciplinaires.  

Morale : sans gouvernance, une erreur devient un scandale.  

---

## 8.11 Schéma global sécurité & gouvernance

```text
             ┌────────────────────────────┐
             │          Sources           │
             └─────────────┬──────────────┘
                           │
                  ┌────────▼─────────┐
                  │    Ingestion     │
                  └───────┬──────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
 ┌───────▼─────────┐               ┌───────▼─────────┐
 │   PII Filter    │               │ Droit à l’oubli │
 │ (nettoyage PII) │               │ (purge sélect.) │
 └───────┬─────────┘               └───────┬─────────┘
         └─────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │ Indexation sécurisée│
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Retrieval hybride   │
              │ (vecteurs + BM25)  │
              └─────────┬──────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Génération (LLM)    │
              │ + prompts contrôlés │
              └─────────┬──────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Gouverneur de risque│
              │ (halluc., PII, etc.)│
              └─────────┬──────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Réponse validée     │
              │ + Audit trail       │
              └─────────┬──────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
┌───────▼────────┐              ┌────────▼────────┐
│ Observabilité  │              │ Audit & Red Team│
│ Logs, metrics  │              │ Tests advers.   │
└────────────────┘              └─────────────────┘

```

---

## 8.12 Tableau récapitulatif

| Mécanisme         | Objectif                          | Exemple concret |
|-------------------|-----------------------------------|-----------------|
| **Filtrage PII**  | Protéger données personnelles     | Presidio, regex |
| **Droit à l’oubli** | Purge sélective corpus           | Suppression par UUID |
| **Cloisonnement** | Éviter fuites croisées            | Multi-tenant isolé |
| **Risk governor** | Bloquer sorties risquées          | Santé / droit / industrie |
| **Auditabilité**  | Conformité légale                 | Sources versionnées |
| **Observabilité** | Suivi qualité et coûts            | OpenTelemetry, dashboards |
| **Red teaming**   | Tester les failles                | GuardrailsAI |

---

## 8.13 Conclusion et transition

Un pipeline RAG sans sécurité native, gouvernance forte et souveraineté assumée n’est plus un outil professionnel :  
c’est un **risque organisationnel majeur**.

Les fuites de PII, les hallucinations jugées recevables, les fuites croisées multi-tenant, l’absence de purge sélective ou de cloisonnement strict ne sont plus des « bugs acceptables » ce sont des **violations réglementaires** (RGPD, EU AI Act high-risk, NIS2, DORA, CRA), des **amendes cumulées** (jusqu’à 4 % du CA mondial + pénalités sectorielles), des **scandales réputationnels** et des **interdictions d’usage** (à l'instar de Samsung en 2023, toujours enseigné comme cas d’école).

Les briques que nous avons vues dans ce chapitre ne sont pas des options luxueuses :  
- Filtrage PII multi-couches (Protecto.ai, NeMo, Bedrock)  
- Droit à l’oubli granulaire (UUID + purge APIs dans Weaviate/Qdrant/Pinecone)  
- Cloisonnement robuste (namespaces, metadata ACL, Zero Trust)  
- Gouverneur de risque transversal (NeMo Guardrails + faithfulness scoring)  
- Souveraineté assumée (Mistral self-hosted, OVH/Scaleway, AWS Sovereign Cloud, hybride local)  
- Observabilité et traçabilité (Langfuse, Phoenix, RAGAS)  
- Red teaming continu (Garak, PyRIT, adversarial rails)

Ensemble, elles forment un **cercle vertueux** :  
- **Sécurité** : protection immédiate contre fuites et injections  
- **Gouvernance** : confiance légale, audits et conformité (RGPD, EU AI Act, ISO 42001)  
- **Souveraineté** : indépendance stratégique, maîtrise des données et résilience géopolitique  

Sans elles, on reste dans des **pipelines-jouets** , fragiles et non viables pour les secteurs critiques.  
Avec elles, on obtient des **systèmes de confiance** capables d’équiper hôpitaux, tribunaux, ministères, banques, industries et administrations publiques.

Le prochain chapitre (Chapitre 9) explorera les **extensions possibles du pipeline** : mémoire longue, agents, multi-modalité.
