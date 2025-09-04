# Chapitre 6 — Anatomie du pipeline

---

## 6.1 Introduction

Après avoir vu l’importance d’une architecture antifragile (Chapitre 5), détaillons maintenant le cœur opérationnel : le **pipeline**.  
Un pipeline bien conçu ne se limite pas à coller un moteur vectoriel à un modèle : c’est une **chaîne organisée d’étapes spécialisées**, coordonnées par un orchestrateur.  

---

## 6.2 Vue d’ensemble

Un pipeline antifragile suit quatre grandes étapes : **ingestion → retrieval → génération → vérification**, sous la supervision d’un orchestrateur.

```text
[ Ingestion ] → [ Retrieval ] → [ Génération ] → [ Vérification ]
                           ↑
                  [ Orchestrateur central ]
```

👉 Chaque étape joue un rôle précis. Si l’une faiblit, l’ensemble ne doit pas s’écrouler.

---

## 6.3 Étape 1 : Ingestion

L’ingestion est la **porte d’entrée** du pipeline.  
Elle consiste à transformer des données brutes en documents exploitables.

### Bonnes pratiques
- Normaliser les formats (PDF, Word, JSON, APIs).  
- Nettoyer le bruit (footers, doublons, OCR correct).  
- Extraire des métadonnées (date, auteur, version, source).  

### Erreurs courantes
- Parsing incomplet (ex. PDF scannés mal traités).  
- Absence de suivi des versions.  
- Manque de pipeline d’ETL clair.  

👉 Une ingestion fragile = retrieval biaisé dès le départ.

---

## 6.4 Étape 2 : Retrieval

Le retrieval est le **moteur de recherche interne** du pipeline.  
C’est lui qui va sélectionner les documents les plus pertinents.

### Techniques
- **Vector search** : recherche par embeddings.  
- **Hybrid search** : combiner vecteurs + BM25.  
- **Re-ranking** : reclasser les résultats avec un modèle spécialisé.  

### Bonnes pratiques
- Choisir la bonne granularité (chunks ni trop petits ni trop gros).  
- Ajouter des filtres sémantiques et des métadonnées.  
- Surveiller la précision/recall via métriques.  

👉 Retrieval robuste = moins d’hallucinations.

---

## 6.5 Étape 3 : Génération

La génération correspond au **travail du LLM** : formuler une réponse en utilisant les documents trouvés.

### Bonnes pratiques
- Encadrer le prompt (instructions claires, citations obligatoires).  
- Limiter le rôle du modèle à l’**assemblage** et non à l’**invention**.  
- Utiliser des gabarits (templates de prompts).  

### Erreurs courantes
- Concaténer trop de documents (bruit + coûts élevés).  
- Laisser le modèle répondre librement sans contrainte.  

👉 Une génération bien encadrée est le cœur de la crédibilité du pipeline.

---

## 6.6 Étape 4 : Vérification

La vérification est l’étape qui transforme une réponse “probable” en une réponse **fiable et gouvernée**.

### Techniques
- **Critic LLM** : un second modèle vérifie la cohérence de la réponse.  
- **Risk governor** : filtre de conformité (données sensibles, RGPD, biais).  
- **Auditabilité** : chaque réponse reliée à ses sources.  

👉 C’est la **ceinture de sécurité** du pipeline.

---

## 6.7 L’orchestrateur

L’orchestrateur est le **chef d’orchestre** :  
- il coordonne les 4 étapes,  
- applique la gouvernance,  
- journalise chaque interaction,  
- gère les fallbacks et la redondance.

Sans orchestrateur, le pipeline est une suite de scripts.  
Avec orchestrateur, c’est une **infrastructure maîtrisée**.

---

## 6.8 Schéma détaillé du pipeline antifragile

```text
[ Ingestion ]
   ├─ OCR / Parsing
   ├─ Nettoyage
   └─ Métadonnées
        │
        ▼
[ Retrieval ]
   ├─ Index vectoriel
   ├─ Hybrid search
   └─ Re-ranking
        │
        ▼
[ Génération ]
   ├─ Prompt template
   ├─ Citations obligatoires
   └─ Multi-LLM
        │
        ▼
[ Vérification ]
   ├─ Critic LLM
   ├─ Risk governor
   └─ Journalisation
        │
        ▼
[ Réponse validée + Audit ]
```

👉 Ce schéma met en évidence les **sous-modules** de chaque étape.

---

## 6.9 Analogie : le pipeline comme organisme vivant

- **Ingestion = système digestif** : transformer la matière brute en nutriments exploitables.  
- **Retrieval = mémoire** : retrouver l’information pertinente.  
- **Génération = langage** : formuler une réponse intelligible.  
- **Vérification = système immunitaire** : détecter et corriger les erreurs.  
- **Orchestrateur = cerveau** : coordonner l’ensemble.  

👉 Le pipeline antifragile se comporte comme un organisme vivant : chaque organe est spécialisé, mais c’est leur coopération qui crée la résilience.

---

## 6.10 Erreurs fréquentes et pièges

- **Mauvais découpage des chunks** : bruit, perte de contexte.  
- **Index non mis à jour** : réponses obsolètes.  
- **Prompts trop longs** : coûts explosifs et dépassements de tokens.  
- **Absence de vérification** : hallucinations validées sans contrôle.  

👉 Les erreurs sont inévitables, mais un pipeline antifragile apprend à les corriger.

---

## 6.11 Monitoring et observabilité

Un pipeline antifragile doit être **observé en continu** :  

- **Logs centralisés** pour tracer chaque étape.  
- **Tableaux de bord qualité** : taux d’hallucinations, recall du retrieval, coûts.  
- **Alertes proactives** : détection de PII, dérive des performances, dépassements budgétaires.  
- **Boucles de feedback** : utiliser les erreurs pour ajuster ingestion, retrieval ou prompts.  

👉 L’observabilité est la clé pour passer de la théorie à la pratique.

---

## 6.12 Exemple chiffré simplifié

- Corpus : 100 000 documents juridiques.  
- Retrieval hybride sélectionne 20 passages pertinents.  
- Génération assemble une réponse avec 5 citations.  
- Vérification par critic-LLM élimine 2 incohérences.  

👉 Résultat : une réponse **fiable, sourcée et générée en <3 secondes**, avec un coût maîtrisé.

---

## 6.13 Cas concrets

- **Santé** : ingestion de protocoles médicaux → retrieval hybride → génération encadrée → vérification par critic-LLM.  
- **Droit** : ingestion de jurisprudences → retrieval multi-index → génération avec citations obligatoires → auditabilité garantie.  
- **Support client** : ingestion de FAQ → retrieval filtré par contexte → génération adaptée au ton → vérification pour éviter les hallucinations.  

---

## 6.14 Comparaison avec les frameworks actuels

Beaucoup de frameworks actuels implémentent seulement : **ingestion + retrieval + génération**.  
👉 La **vérification** et l’**orchestrateur** sont souvent absents.  

C’est la différence entre :  
- un pipeline de **démonstration** (rapide mais fragile),  
- et une architecture **antifragile** (robuste, traçable, souveraine).  

---

## 6.15 Conclusion et transition

L’anatomie du pipeline révèle une vérité simple :  
👉 **chaque étape est un maillon critique**.  

Une ingestion fragile biaise tout le reste.  
Un retrieval faible augmente les hallucinations.  
Une génération non encadrée perd la crédibilité.  
Une absence de vérification supprime la confiance.  

Ce n’est pas un luxe, c’est une nécessité : un pipeline antifragile doit être conçu comme un **organisme complet**, avec un orchestrateur comme cerveau.

---

## 6.16 Transition vers le Chapitre 7

Le prochain chapitre confrontera cette vision **pipeline modulaire** avec les **frameworks actuels** : LangChain, LlamaIndex, Haystack…  
👉 Chapitre 7 : **Modularité vs frameworks**.
