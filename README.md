# 📖 RAG : Architectures Antifragiles pour l'IA Générative

**Manifeste et Guide Technique** par Fatima-Ezzahra Bouzidi Idrissi

Site web du livre, construit avec [Nextra](https://nextra.site/) et déployé sur [Vercel](https://vercel.com).

## 🚀 Déploiement sur Vercel (3 étapes)

### 1. Push ce dossier sur GitHub

```bash
cd livre-rag-site
git init
git add .
git commit -m "🚀 Initial commit - Livre RAG site"
git remote add origin https://github.com/fati54/livre-rag-site.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub
2. Clique sur **"Add New Project"**
3. Sélectionne le repo **livre-rag-site**
4. Vercel détecte automatiquement Next.js — clique sur **Deploy**
5. En 1-2 minutes, ton site est live ! 🎉

### 3. (Optionnel) Domaine custom

Dans les settings Vercel du projet, tu peux ajouter un domaine custom :
- `livre.pedagen.com`
- `rag.fati.dev`
- ou tout autre domaine que tu possèdes

## 💻 Développement local

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 📁 Structure

```
pages/
├── _meta.json          # Navigation sidebar
├── _app.tsx            # Import des styles
├── index.mdx           # Page d'accueil (titre + mot d'ouverture)
├── 01-introduction.mdx # Chapitre 1
├── 02-pourquoi-rag.mdx # Chapitre 2
├── ...                 # Chapitres 3-12
├── 13-conclusion.mdx   # Chapitre 13
└── 14-annexes.mdx      # Annexes
public/
└── images/             # Images du livre
theme.config.tsx        # Configuration du thème (logo, footer, SEO)
styles/
└── globals.css         # Styles custom (book feel)
```

## ✏️ Modifier le contenu

Édite directement les fichiers `.mdx` dans `pages/`. Push sur GitHub → Vercel redéploie automatiquement.

## 📝 Licence

© 2025 Fatima-Ezzahra Bouzidi Idrissi — Tous droits réservés.
