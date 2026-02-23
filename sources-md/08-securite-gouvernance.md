# Chapitre 8 : Sécurité, gouvernance et souveraineté

---

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

Un pipeline mal conçu peut aspirer et ré-exposer des **données personnelles identifiables (PII)**.  

### Exemples
- Nom, adresse, email dans un log.  
- Numéro de sécurité sociale dans un document.  
- Données médicales dans un rapport.  

### Risques
- **Juridiques** : RGPD en Europe, HIPAA aux US.  
- **Réputationnels** : scandales médiatiques.  
- **Opérationnels** : perte de confiance interne.  

### Solutions
- **Filtrage PII** intégré **en amont et en aval**.  
  - Amont → nettoyage dès l’ingestion.  
  - Aval → scan de la réponse générée.  
- **Outils** : Microsoft Presidio, spaCy NER + règles + critic-LLM

---

## 8.3 Le droit à l’oubli

Une fois indexé, un document est rarement supprimable.  
Mais un pipeline responsable doit permettre la **purge sélective** (par chunk, UUID).  

La **souveraineté documentaire** repose sur cette capacité.  

---

## 8.4 Cloisonnement des données

Un pipeline naïf mélange tout : données internes, externes, multi-clients.  
Résultat : risque de **fuites croisées**.  

### Exemple réel (2023)  
**Samsung** a interdit ChatGPT après des fuites de code interne dans les logs OpenAI.  

### Solution
- **Multi-tenancy sécurisé**.  
- **Namespaces isolés**.  
- **Politiques d’accès strictes** (RBAC, Zero Trust).  

---

## 8.5 Le gouverneur de risque

Innovation clé : un **module transversal** qui vérifie la sortie avant exposition.  

### Rôle
- Détecter les violations (PII, hallucinations, jailbreak).  
- Appliquer des politiques (bloquer, reformuler, escalader).  

### Exemples
- Santé → bloquer toute recommandation hors guidelines médicales.  
- Droit → empêcher la citation d’une jurisprudence inventée.  
- Industrie → filtrer toute fuite de secret.  

```text
[ Génération (LLM) ] → [ Gouverneur de risque ] → [ Réponse validée ]
```

---

## 8.6 La souveraineté comme enjeu stratégique

Où tourne le pipeline ? Qui contrôle ?  

- **Cloud public US** → rapide, mais dépendant (Cloud Act).  
- **Cloud souverain / local** → plus coûteux, mais maîtrise totale.  
- **Hybride** → local par défaut, fallback API externe si besoin.  

La souveraineté n’est pas un luxe, mais un **prérequis de confiance**.  

---

## 8.7 Observabilité et traçabilité

Un pipeline RAG doit être **observable**.  
Chaque réponse doit être traçable :  
- Quelle requête utilisateur ?  
- Quels documents utilisés ?  
- Quelles règles appliquées ?  

### Outils
- **OpenTelemetry**, **W&B**, **MLflow**, dashboards custom.  
- **Alertes proactives** (fuite de PII, coûts anormaux, dérive qualité).  

L’observabilité est la colonne vertébrale de la gouvernance.  

---

## 8.8 Auditabilité et conformité

Un pipeline peut viser des certifications (ex. ISO 27001, SOC 2) et la conformité HIPAA / RGPD, ou être validé pour un usage clinique.

Cela suppose :  
- **Journalisation** (qui a fait quoi, quand).  
- **Versioning documentaire** (quelle version d’un texte était en vigueur).  
- **Explicabilité** (source exacte de chaque réponse).  

---

## 8.9 Red teaming et tests adversariaux

Le pipeline doit être testé **contre ses propres failles** :  
- Injection de prompts.  
- Exfiltration de données.  
- Tentatives de jailbreak.  

### Outils
- **GuardrailsAI**, **NeMo Guardrails**, **firewalls IA**.  

Le red teaming est une assurance-vie : on découvre les failles avant les attaquants.  

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

La **sécurité**, la **gouvernance** et la **souveraineté** forment un **cercle vertueux** :  
- **Sécurité** → protection immédiate.  
- **Gouvernance** → confiance légale et organisationnelle.  
- **Souveraineté** → indépendance stratégique.  

Sans elles, on obtient des **pipelines-jouets**.  
Avec elles, on obtient des **pipelines critiques**, capables de soutenir santé, droit, économie.  

Le prochain chapitre (Chapitre 9) explorera les **extensions possibles du pipeline** : mémoire longue, agents, multi-modalité.
