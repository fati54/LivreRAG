# Chapitre 11 — Comparaison avec les alternatives au RAG

---

## 11.1 Introduction

Le RAG n’est pas la seule approche pour dépasser les limites des LLMs.  
Ce chapitre compare les **alternatives majeures** : finetuning, moteurs de recherche traditionnels, règles expertes, et combinaisons hybrides.  

---

## 11.2 Finetuning des modèles

### Description
Adapter un LLM aux données d’une organisation via réentraînement ou fine-tuning.  

### Avantages
- Le modèle intègre directement le savoir.  
- Réduction des coûts d’inférence (moins besoin de retrieval).  
- Performances meilleures sur tâches spécifiques.  

### Limites
- Coûts d’entraînement élevés.  
- Obsolescence rapide (données statiques).  
- Risque de fuite si le modèle est exposé.  

### Cas idéal
- Domaine stable (biologie structurée, taxonomies fixes).  
- Données fermées et non changeantes.  

---

## 11.3 Moteurs de recherche traditionnels

### Description
Approches basées sur BM25, Elasticsearch, Solr, etc.  

### Avantages
- Simplicité, scalabilité, maturité.  
- Coûts réduits.  
- Gouvernance plus simple (index documentaires).  

### Limites
- Pas de génération de réponse, seulement de la recherche.  
- Ne comprend pas le langage de manière profonde.  

### Cas idéal
- Recherche documentaire classique (jurisprudence, catalogue produits).  

---

## 11.4 Règles expertes et systèmes symboliques

### Description
Systèmes basés sur des règles (if/then), ontologies, graphes de connaissances.  

### Avantages
- Précision et explicabilité.  
- Gouvernance forte.  
- Facile à certifier (ISO, médical).  

### Limites
- Faible couverture si règles incomplètes.  
- Maintenance lourde.  

### Cas idéal
- Conformité réglementaire stricte.  
- Environnements normés (aviation, médecine).  

---

## 11.5 Architectures hybrides

### Description
Combiner plusieurs approches :  
- RAG + finetuning.  
- RAG + règles expertes.  
- Recherche traditionnelle + LLM.  

### Avantages
- Bénéficie du meilleur des deux mondes.  
- Résilience et flexibilité accrues.  

### Limites
- Complexité d’orchestration.  
- Coûts de maintenance.  

### Cas idéal
- Projets critiques où robustesse et précision sont indispensables.  

---

## 11.6 Schéma comparatif

```text
Finetuning      → modèle enrichi mais statique
BM25 / Search   → robuste mais non génératif
Règles expertes → explicables mais limitées
RAG             → flexible mais nécessite gouvernance
Hybrides        → puissants mais complexes
```

---

## 11.7 Tableau synthétique

| Approche        | Avantages                        | Limites                        | Cas idéal |
|-----------------|----------------------------------|--------------------------------|-----------|
| Finetuning      | Intègre savoir, spécialisation   | Coût, obsolescence             | Domaines stables |
| Recherche (BM25)| Simple, scalable, peu coûteux    | Pas de génération              | Catalogues, docs |
| Règles expertes | Explicables, gouvernance forte   | Faible couverture, rigide      | Secteurs régulés |
| RAG             | Flexible, personnalisable        | Gouvernance complexe           | Données évolutives |
| Hybrides        | Résilients, polyvalents          | Complexité, maintenance        | Usages critiques |

---

## 11.8 Conclusion et transition

Chaque approche a ses forces et faiblesses.  
Le RAG n’est pas une solution universelle : il s’inscrit dans un **continuum de stratégies**.  

👉 Le prochain chapitre (Chapitre 12) explorera les **limites et défis persistants** même avec RAG et ses alternatives.
