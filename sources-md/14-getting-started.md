# Chapitre 14 : Par où commencer ?

---

## Un guide de démarrage, pas un cours magistral

Ce manifeste a posé une vision, une architecture, des principes.  
Mais un livre qui ne donne pas les clés pour **passer à l'action** reste un exercice théorique.  

Ce chapitre est un **guide de démarrage en 5 étapes**, pensé pour un ingénieur ou une équipe qui veut construire un premier pipeline RAG antifragile.

---

## Étape 1 : Commencer petit, mais bien structuré

Ne tentez pas de construire l'architecture complète dès le premier jour.  
Commencez par un **cas d'usage unique et bien délimité** :

- un assistant sur une FAQ interne,
- un moteur de recherche sur des documents techniques,
- un copilote sur un corpus juridique restreint.

L'erreur classique : vouloir indexer "tous les documents de l'entreprise" dès le jour 1.

### Checklist de démarrage

```yaml
# step_1_scope.yaml
cas_usage:
  nom: "Assistant FAQ support client"
  corpus: "200 documents FAQ (PDF + Markdown)"
  utilisateurs: "équipe support niveau 1"
  critère_succès: "80% des réponses jugées pertinentes par les utilisateurs"
  contraintes:
    - "pas de données personnelles dans le corpus"
    - "réponses en français uniquement"
```

---

## Étape 2 : Poser les fondations modulaires

Même pour un POC, structurez votre code en **4 modules distincts** dès le départ :

```text
project/
├── config/
│   └── pipeline_config.yaml      # Configuration centralisée
├── modules/
│   ├── ingestion/
│   │   ├── loader.py             # Chargement PDF, Markdown, etc.
│   │   ├── cleaner.py            # Nettoyage, OCR
│   │   └── chunker.py            # Découpage en chunks
│   ├── retrieval/
│   │   ├── vector_search.py      # Recherche vectorielle
│   │   ├── bm25_search.py        # Recherche lexicale
│   │   └── reranker.py           # Re-classement
│   ├── generation/
│   │   ├── prompt_builder.py     # Construction des prompts
│   │   └── llm_client.py         # Client LLM (agnostique)
│   └── verification/
│       ├── critic.py             # Critic LLM
│       └── risk_governor.py      # Gouverneur de risque
├── orchestrator.py               # Chef d'orchestre
├── main.py
└── tests/
```

**Pourquoi maintenant ?** Parce que migrer d'un script monolithique vers une architecture modulaire coûte 10x plus cher que de bien structurer dès le départ.

---

## Étape 3 : Construire un pipeline minimal viable

Voici le code minimal pour un pipeline fonctionnel :

```python
# main.py : Pipeline RAG minimal mais modulaire
import yaml
from modules.ingestion.loader import load_documents
from modules.ingestion.chunker import chunk_documents
from modules.retrieval.vector_search import VectorSearch
from modules.generation.llm_client import LLMClient
from modules.generation.prompt_builder import build_prompt

# 1. Charger la config
with open("config/pipeline_config.yaml") as f:
    config = yaml.safe_load(f)

# 2. Ingestion (une seule fois)
docs = load_documents("data/faq/")
chunks = chunk_documents(docs, size=config["ingestion"]["chunk_size"])

# 3. Indexation
search = VectorSearch(
    model=config["retrieval"]["embedding_model"],
    db=config["retrieval"]["vector_db"],
)
search.index(chunks)

# 4. Pipeline de requête
def query(question: str) -> dict:
    # Retrieval
    results = search.search(question, top_k=config["retrieval"]["top_k"])
    
    # Génération
    prompt = build_prompt(question, results, citations_required=True)
    llm = LLMClient(provider=config["generation"]["llm_provider"])
    response = llm.generate(prompt)
    
    return {
        "answer": response.text,
        "sources": [r["metadata"] for r in results],
    }

# Test
result = query("Comment résilier mon contrat ?")
print(result["answer"])
for src in result["sources"]:
    print(f"  → {src['filename']} (p.{src.get('page', '?')})")
```

**Remarque** : pas de vérification à cette étape. C'est normal : on l'ajoute à l'étape suivante. L'important est que la structure modulaire soit en place.

---

## Étape 4 : Ajouter la vérification

C'est l'étape qui transforme un prototype en **système digne de confiance**.

```python
# modules/verification/critic.py : Critic LLM minimal
class BasicCritic:
    """Vérifie que la réponse est cohérente avec les sources."""
    
    def __init__(self, llm_client):
        self.llm = llm_client
    
    def verify(self, response: str, sources: list) -> dict:
        sources_text = "\n".join(s["content"] for s in sources)
        
        prompt = f"""Vérifie cette réponse par rapport aux sources.
        
SOURCES:
{sources_text}

RÉPONSE:
{response}

Réponds en JSON:
- "is_faithful": true si la réponse est fidèle aux sources
- "issues": liste des problèmes détectés (vide si aucun)
"""
        result = self.llm.generate(prompt, response_format="json")
        return result
```

### Intégration dans le pipeline

```python
# Ajouter après la génération dans main.py
from modules.verification.critic import BasicCritic

critic = BasicCritic(llm_client=LLMClient(provider="anthropic"))
check = critic.verify(response.text, results)

if not check["is_faithful"]:
    print(f"⚠️  Problèmes détectés : {check['issues']}")
    # Option : reformuler, bloquer, ou escalader
```

---

## Étape 5 : Observer, itérer, durcir

Un pipeline sans observabilité est un pipeline aveugle.

### Métriques minimales à suivre

| Métrique | Comment la mesurer | Seuil d'alerte |
|----------|-------------------|----------------|
| Taux de pertinence | Feedback utilisateur (pouce haut/bas) | < 75% |
| Latence p95 | Timer sur le pipeline complet | > 5 secondes |
| Taux d'hallucinations | Critic LLM (is_faithful = false) | > 10% |
| Coût par requête | Compteur de tokens LLM | > seuil budget |

### Boucle d'amélioration

```text
Déployer → Mesurer → Identifier les faiblesses → Corriger → Redéployer
     ↑                                                          │
     └──────────────────────────────────────────────────────────┘
```

Les erreurs les plus fréquentes au démarrage :

1. **Chunks trop gros** → le LLM noie l'information pertinente. Réduisez à 256-512 tokens.
2. **Pas de re-ranking** → les premiers résultats vectoriels ne sont pas toujours les meilleurs. Ajoutez un cross-encoder.
3. **Prompt trop permissif** → le LLM invente au lieu de citer. Ajoutez "Réponds uniquement à partir des sources fournies."
4. **Pas de fallback** → si l'API LLM tombe, tout s'arrête. Configurez un modèle local en secours.

---

## Récapitulatif : les 5 étapes

| Étape | Action | Durée estimée |
|-------|--------|---------------|
| **1** | Définir un cas d'usage restreint | 1 jour |
| **2** | Structurer le projet en modules | 1-2 jours |
| **3** | Pipeline minimal viable | 2-3 jours |
| **4** | Ajouter la vérification | 1-2 jours |
| **5** | Observer et itérer | Continu |

En **une semaine**, vous avez un pipeline modulaire, vérifiable et évolutif.  
Pas un jouet fragile, mais la **première brique d'une architecture antifragile**.

---

## Et ensuite ?

Une fois ce socle en place, les prochaines itérations peuvent ajouter :

- **Retrieval hybride** (vecteurs + BM25) : cf. Chapitre 6.
- **Time-travel retrieval** pour les corpus versionnés : cf. Chapitre 9.
- **Mémoire pyramidale** pour les conversations longues : cf. Chapitre 9.
- **Gouverneur de risque** pour les cas critiques : cf. Chapitre 8.
- **Observabilité avancée** (OpenTelemetry, dashboards) : cf. Chapitre 8.

Chaque extension est un module indépendant. C'est la force de l'approche modulaire : **on ajoute sans tout casser**.

---

## Dernier conseil

Le piège le plus dangereux n'est pas technique : c'est de **rester éternellement en mode POC**.  
Le passage à la production demande trois choses que la plupart des équipes repoussent :

1. La **vérification** (critic LLM, risk governor).
2. L'**observabilité** (logs, métriques, alertes).
3. La **gouvernance** (qui accède à quoi, conformité RGPD).

Si vous ne les intégrez pas dès le départ, vous les intégrerez dans la douleur.  
Ce manifeste existe pour vous éviter cette douleur.

---

📌 *Le chemin de l'antifragilité commence par un premier pipeline bien structuré.*
