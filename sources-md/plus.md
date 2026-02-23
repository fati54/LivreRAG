# 🧩 Schéma du pipeline RAG modulaire & antifragile 

![Schéma global — Pipeline RAG modulaire & antifragile](images/pipeline.png "Pipeline RAG modulaire & antifragile")


```mermaid
flowchart TD
    Sources[📂 Sources hétérogènes<br/>txt · pdf · audio · vidéo · images · tables · APIs] --> Ingestion[⚙️ Ingestion enrichie<br/>Nettoyage/OCR · Structuration (chunks)<br/>Métadonnées complètes]
    Ingestion --> Gouvernance[🔒 Gouvernance & qualité<br/>PII Filter · Droit à l’oubli<br/>Cloisonnement multi-tenant · Validation]
    Gouvernance --> Indexation[📚 Indexation multimodale<br/>Multi-index (texte, audio, image, vidéo, tables)]
    Indexation --> Retrieval[🔍 Retrieval hybride<br/>vecteurs + BM25 · re-ranking<br/>time-travel · mémoire pyramidale]
    Retrieval --> Generation[🧠 Génération LLM<br/>prompts contrôlés · citations obligatoires]
    Generation --> Verification[✅ Vérification<br/>Critic LLM · Gouverneur de risque<br/>Fact-check & règles]
    Verification --> Observabilite[📊 Observabilité & Audit<br/>logs · red teaming · conformité]
    Observabilite --> Reponse[📌 Réponse validée & traçable]
```
