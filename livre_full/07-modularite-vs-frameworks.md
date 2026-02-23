# Chapitre 7 : Modularité vs frameworks

---

## 7.1 Introduction

Après avoir détaillé l’anatomie du pipeline (Chapitre 6), il est essentiel de comparer deux approches qui coexistent aujourd’hui :  
**les frameworks intégrés** (LangChain, LlamaIndex, Haystack…) et **le pipeline modulaire**.  

Cette comparaison est centrale : elle détermine si l’on construit un **prototype rapide** ou une **infrastructure durable**.

---

## 7.2 Les frameworks intégrés

Les frameworks intégrés proposent une approche “clé en main” pour brancher ingestion, retrieval et génération.  
Ils séduisent par leur rapidité, mais reposent sur une logique **monolithique déguisée**.

### Schéma typique d’un framework intégré

```text
[ Ingestion basique ]
        │
        ▼
[ Retrieval vectoriel ]
        │
        ▼
[ Génération LLM ]
        │
        ▼
[ Réponse brute ]
```

### Avantages
- Prototypage rapide.  
- Documentation et communauté actives.  
- Large choix de connecteurs.  

### Limites
- Couplage fort aux abstractions internes.  
- API changeantes, dette technique.  
- Gouvernance et observabilité absentes.  
- Risque de lock-in technologique.  

### Exemple concret
Une **startup** utilise LangChain pour présenter un POC en deux semaines. La démo convainc, mais dès que la volumétrie augmente et que la conformité RGPD entre en jeu, la dette technique explose.

---

## 7.3 Le pipeline modulaire

Un pipeline modulaire applique les principes vus au Chapitre 4 : modularité, agnosticité, configurabilité, antifragilité.  
Il est pensé comme une **infrastructure orchestrée et traçable**.

### Schéma typique d’un pipeline modulaire

```text
[ Ingestion robuste ]
   ├─ Parsing avancé
   ├─ Nettoyage
   └─ Métadonnées
        │
        ▼
[ Retrieval hybride ]
   ├─ Vector search
   ├─ BM25
   └─ Re-ranking
        │
        ▼
[ Génération encadrée ]
   ├─ Templates de prompts
   ├─ Citations obligatoires
   └─ Multi-LLM
        │
        ▼
[ Vérification ]
   ├─ Critic LLM
   ├─ Risk governor
   └─ Auditabilité
        │
        ▼
[ Réponse validée ]
        │
        ▼
[ Orchestrateur central ]
```

### Avantages
- Robustesse et traçabilité.  
- Évolutivité (chaque module peut évoluer).  
- Observabilité et gouvernance natives.  
- Souveraineté : pas de dépendance unique.  

### Limites
- Mise en place plus exigeante.  
- Besoin d’une équipe d’ingénierie solide.  

### Exemple concret
Une **banque** met en place un pipeline modulaire souverain. Résultat : conformité RGPD, auditabilité des réponses et robustesse en production critique.

---

## 7.4 Comparaison séquentielle

### ❌ Framework intégré

```text
[ Ingestion basique ]
        │
        ▼
[ Retrieval simple ]
        │
        ▼
[ Génération brute ]
        │
        ▼
[ Réponse brute ]
```

### ✅ Pipeline modulaire

```text
[ Ingestion robuste ]
        │
        ▼
[ Retrieval hybride + re-ranking ]
        │
        ▼
[ Génération encadrée ]
        │
        ▼
[ Vérification + Audit + Gouvernance ]
        │
        ▼
[ Orchestrateur central ]
```

---

## 7.5 Cas pratiques détaillés

- **Migration progressive** : une entreprise industrielle commence avec Flowise pour prototyper rapidement. Puis, au moment de la mise en production, elle migre vers un pipeline modulaire orchestré pour intégrer gouvernance et monitoring.  

- **Santé** : un hôpital expérimente un chatbot médical avec LlamaIndex. Dès que la conformité HIPAA est exigée, la solution est remplacée par un pipeline modulaire avec critic-LLM et contrôle des PII.  

- **Juridique** : un cabinet déploie un assistant sur LangChain. L’absence de traçabilité provoque une erreur majeure (jurisprudence inventée). Après incident, l’équipe reconstruit un pipeline modulaire avec auditabilité stricte.  

---

## 7.6 Erreurs fréquentes

- **Confondre framework et architecture** : un framework est une boîte à outils, pas une architecture complète.  
- **Se rendre dépendant d’une API fermée** : migrer devient un cauchemar.  
- **Croire qu’un POC est suffisant pour la production** : ce qui marche en démo échoue en conditions réelles.  

---

## 7.7 Coûts et ROI

- **Court terme** : les frameworks intégrés minimisent les coûts initiaux, mais la dette technique augmente rapidement avec la montée en charge.  
- **Long terme** : le pipeline modulaire demande un investissement upfront plus élevé, mais offre un **ROI supérieur** grâce à la maintenance simplifiée, la conformité intégrée et la flexibilité.  

Les organisations doivent penser en **coût total de possession (TCO)**, pas seulement en coût de démarrage.

---

## 7.8 Courbe de maturité

On peut voir les frameworks et le pipeline modulaire comme deux **étapes dans un cycle de maturité** :

- **Framework intégré** : idéal en phase **exploration / prototypage**.  
- **Pipeline modulaire** : incontournable en phase **industrialisation / production critique**.  

```text
Exploration (POC rapide) → Industrialisation (pipeline modulaire)
```

---

## 7.9 Synthèse comparative

| Critère           | Framework intégré (ex. LangChain) | Pipeline modulaire |
|-------------------|-----------------------------------|--------------------|
| **Rapidité**      | ⭐⭐⭐⭐⭐ (POC express)              | ⭐⭐⭐ (exigeant)    |
| **Robustesse**    | ⭐⭐ (fragile en prod)             | ⭐⭐⭐⭐⭐             |
| **Traçabilité**   | ⭐ (quasi absente)                | ⭐⭐⭐⭐⭐             |
| **Souveraineté**  | ⭐ (lock-in fréquent)             | ⭐⭐⭐⭐⭐             |
| **Évolutivité**   | ⭐⭐ (API changeantes)             | ⭐⭐⭐⭐⭐             |
| **Coût long terme** | ⭐⭐⭐⭐ (dette technique élevée)  | ⭐⭐⭐ (investissement initial mais pérennité) |
| **Maturité idéale** | Exploration, démo, POC rapide   | Production critique|

---

## 7.10 Référence externe

Selon une étude fictive inspirée des analyses Gartner (2024), plus de **70% des projets LLM échouent à passer du POC à la production** faute d’architecture modulaire et de gouvernance adaptée.  

Cela confirme qu’il ne s’agit pas seulement d’un choix technique, mais d’un **enjeu stratégique**.

---

## 7.11 Conclusion et transition

Les frameworks intégrés sont des **accélérateurs précieux** pour prototyper et évangéliser.  
Mais leur nature même les rend fragiles dès qu’on parle de conformité, de souveraineté et de robustesse.  

Le pipeline modulaire est plus coûteux au départ, mais il constitue la **fondation antifragile** des systèmes de demain.  

Le prochain chapitre (Chapitre 8) explorera en détail la **sécurité et la gouvernance** dans ces architectures.
