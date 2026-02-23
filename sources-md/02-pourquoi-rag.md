# Chapitre 2 — Les promesses et limites du RAG actuel

---

## Le RAG, une promesse séduisante

Face aux limites des LLMs, une idée simple a émergé : **brancher le modèle sur une base documentaire externe**.  
C’est le principe du **RAG (Retrieval-Augmented Generation)** :

1. Un moteur de recherche retrouve les documents pertinents.  
2. Ces documents sont injectés dans le prompt.  
3. Le modèle génère une réponse en s’appuyant dessus.  

En théorie, c’est une petite révolution :  
- le modèle n’est plus figé,  
- il devient capable de répondre avec des données **actualisées, contextualisées et contrôlées**.  

On pourrait résumer la promesse du RAG en trois slogans :  
- *brancher un cerveau sur une bibliothèque*,  
- *donner une mémoire externe au perroquet*,  
- *marier la statistique à la connaissance*.  

---

## Pourquoi ça marche (sur le papier)

Le RAG offre de vrais avantages :

1. **Actualisation** — Le savoir n’est plus limité à la date d’entraînement.  
2. **Personnalisation** — Chaque organisation peut brancher ses propres données (FAQ, manuels internes, bases réglementaires).  
3. **Réduction des hallucinations** — Le modèle se cale sur une source fournie plutôt que d’inventer.  
4. **Économie** — Pas besoin de réentraîner un modèle complet : on nourrit un LLM existant avec de nouvelles données.  

Pas étonnant que le RAG ait été perçu comme un **sauveur** : une rustine élégante au problème du savoir figé.

---

## Le mirage du RAG clé en main

Mais là encore, une illusion s’est installée.  
Dans les discours commerciaux, le RAG est présenté comme une solution magique :  
👉 *“Ajoutez un moteur vectoriel et vos problèmes de vérité sont réglés !”*

En pratique, les implémentations sont souvent **simplistes** :  
- ingestion brute de documents PDF,  
- découpage naïf en *chunks*,  
- stockage dans une base vectorielle,  
- retrieval + concaténation dans le prompt.  

Ce pipeline minimaliste fonctionne pour une démo… mais il s’effondre vite en conditions réelles.  
On parle alors de **prototype maquillé en produit fini**.

---

## Les limites techniques du RAG actuel

1. **Qualité de l’ingestion** — Un PDF scanné mal parsé = embeddings inutiles. Sans pipeline robuste d’ingestion (OCR, nettoyage, structuration), le retrieval est biaisé dès le départ.  
2. **Granularité du découpage** — Trop gros chunks = bruit ; trop petits = perte de contexte.  
3. **Scores trompeurs** — La similarité cosinus ne garantit pas la pertinence sémantique.  
4. **Dépendance au modèle** — Beaucoup d’implémentations reposent sur le même fournisseur (souvent OpenAI), créant dépendance et manque d’agilité.  
5. **Hallucinations persistantes** — Même avec des documents injectés, le LLM peut les ignorer ou les transformer.  
6. **Scalabilité** — Avec des millions de documents, l’indexation et la recherche deviennent coûteuses. Peu de solutions gèrent efficacement les grands volumes.  

---

## Les limites organisationnelles

1. **Absence de gouvernance** — Que faire si un utilisateur injecte des données sensibles ? Qui contrôle la conformité RGPD ?  
2. **Pas de traçabilité** — La plupart des frameworks ne permettent pas d’expliquer quelle source exacte a produit telle phrase.  
3. **Fragilité face aux évolutions** — Changer de modèle, de base vectorielle ou de méthode d’ingestion = souvent tout réécrire.  
4. **Promesse marketing vs réalité** — De nombreux acteurs vendent des “assistants intelligents”, mais derrière : un simple moteur vectoriel branché sur un modèle fermé.

---

## Comparaison des frameworks actuels

- **LangChain** : populaire, mais vite devenu un *“lego spaghetti”* (sur-complexe, fragile).  
- **LlamaIndex** : élégant et centré sur la gestion documentaire, mais jeune et instable.  
- **Haystack** : robuste côté NLP classique, moins fluide pour la génération hybride.  
- **RAGFlow, Weaviate, Pinecone…** : chaque acteur pousse sa solution, souvent fermée et orientée lock-in.  

Chacun a ses forces, mais tous partagent une faiblesse : **ils n’abordent pas la question de l’architecture modulaire et souveraine**.

---

## 📊 Synthèse visuelle — Avantages vs Limites

| Aspect | Promesse du RAG | Réalité / Limites |
|--------|-----------------|-------------------|
| **Actualisation** | Le savoir n’est plus limité à la date d’entraînement. | Dépend d’une ingestion fiable → sinon corpus vite obsolète. |
| **Personnalisation** | Chaque organisation peut brancher ses données internes. | Souvent bricolé → ingestion brute de PDF, peu de structuration. |
| **Réduction hallucinations** | Le modèle se cale sur les documents fournis. | Les ignore ou les transforme → “hallucinations augmentées”. |
| **Économie** | Pas besoin de réentraîner → simple injection de données. | Coût caché : indexation lourde, vector DB, réindexations fréquentes. |
| **Scalabilité** | Théoriquement extensible à de grands corpus. | En pratique, explosion des coûts et lenteur avec millions de docs. |
| **Traçabilité & gouvernance** | Sources visibles, pipeline transparent. | Quasi absentes → pas d’audit clair, risques RGPD. |

---

## 🔀 Schéma comparatif — RAG naïf vs RAG robuste

### ❌ RAG naïf (pipeline fragile)

```text
[ Docs PDF bruts ]
│
▼
[ Découpage naïf en chunks ]
│
▼
[ Base vectorielle unique ]
│
▼
[ LLM (prompt concaténé) ]
│
▼
[ Réponse brute ]

```

- Facile à déployer en démo.  
- Mais fragile, coûteux et non gouverné.  

---

### ✅ RAG robuste (pipeline évolutif)

```text
[ Sources variées ]
 (docs internes, bases légales, APIs)
       │
       ▼
[ Ingestion robuste ]
 (OCR, nettoyage, structuration, métadonnées)
       │
       ▼
[ Indexation hybride ]
 (vecteurs + BM25 + re-ranking)
       │
       ▼
[ LLM génératif ]
 (prompts contrôlés, citations obligatoires)
       │
       ▼
[ Vérification ]
 (critic LLM, risk governor, traçabilité)
       │
       ▼
[ Réponse validée + auditable ]

```
---

## Un pas dans la bonne direction, mais pas suffisant

Le RAG n’est pas inutile :  
- il a ouvert la voie à la personnalisation,  
- il a permis d’atténuer certaines hallucinations,  
- il a inspiré des architectures hybrides.  

Mais dans sa forme actuelle, il reste une **béquille**.  
👉 Pas encore une colonne vertébrale.

---

## Conclusion du chapitre

Le RAG actuel a créé une attente légitime : sortir du mythe du modèle omniscient.  
Mais ses implémentations restent **immatures, fragiles, mal gouvernées**.  

Le message est clair : **le RAG est une promesse, pas encore une solution**.  
Il doit évoluer vers un pipeline **modulaire, agnostique et configurable** pour devenir réellement robuste.  

C’est précisément l’objet de ce manifeste : montrer comment transformer cette rustine en une **architecture antifragile**, capable de soutenir des usages critiques.




Le prochain chapitre examinera **les problèmes structurels non résolus** — hallucinations, biais, obsolescence et coûts — qui expliquent pourquoi le RAG naïf ne suffit pas en production critique.
