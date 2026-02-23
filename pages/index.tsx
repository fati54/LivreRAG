import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

type Chapter = {
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
};

const icons = {
  nodes: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="3" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7.7 10.9L16 7.3" />
      <path d="M7.7 13.1L16 16.7" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15l6-6" />
      <path d="M9 9l6 2-2 6z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  graph: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <circle cx="8" cy="14" r="2" />
      <circle cx="13" cy="10" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M9.5 12.5l2.5-1.5" />
      <path d="M14.5 8.5l2.5-1.5" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6" />
      <path d="M10 3v5l-5 9a4 4 0 0 0 3.5 6h7a4 4 0 0 0 3.5-6l-5-9V3" />
      <path d="M8 15h8" />
    </svg>
  ),
};

const chapters: Chapter[] = [
  {
    title: "Introduction",
    subtitle: "Le cadre antifragile",
    href: "/01-introduction",
    icon: icons.compass,
  },
  {
    title: "Promesses & limites",
    subtitle: "Pourquoi le RAG reste clé",
    href: "/02-pourquoi-rag",
    icon: icons.layers,
  },
  {
    title: "Comparaison des approches",
    subtitle: "RAG vs fine-tuning",
    href: "/03-comparaison-approches",
    icon: icons.graph,
  },
  {
    title: "Principes fondateurs",
    subtitle: "Les 4 piliers",
    href: "/04-principes-cles",
    icon: icons.nodes,
  },
  {
    title: "Architecture détaillée",
    subtitle: "Design systémique",
    href: "/05-architecture-detaillee",
    icon: icons.layers,
  },
  {
    title: "Anatomie du pipeline",
    subtitle: "Ingestion, retrieval, vérif",
    href: "/06-anatomie-pipeline",
    icon: icons.nodes,
  },
  {
    title: "Modularité vs frameworks",
    subtitle: "LangChain, LlamaIndex",
    href: "/07-modularite-vs-frameworks",
    icon: icons.compass,
  },
  {
    title: "Sécurité & gouvernance",
    subtitle: "PII, RGPD, souveraineté",
    href: "/08-securite-gouvernance",
    icon: icons.shield,
  },
  {
    title: "Extensions du pipeline",
    subtitle: "Reranking, agents, tools",
    href: "/09-extensions-pipeline",
    icon: icons.graph,
  },
  {
    title: "Cas d’usage",
    subtitle: "Santé, droit, industrie",
    href: "/10-cas-usages",
    icon: icons.layers,
  },
  {
    title: "Alternatives au RAG",
    subtitle: "Ce qu’on compare vraiment",
    href: "/11-comparaison-alternatives",
    icon: icons.compass,
  },
  {
    title: "Limites & défis",
    subtitle: "Où ça casse, pourquoi",
    href: "/12-limites-defis",
    icon: icons.lab,
  },
  {
    title: "Conclusion générale",
    subtitle: "Synthèse & perspectives",
    href: "/13-conclusion",
    icon: icons.nodes,
  },
  {
    title: "Par où commencer",
    subtitle: "Feuille de route",
    href: "/14-getting-started",
    icon: icons.graph,
  },
  {
    title: "Annexes",
    subtitle: "Glossaire & ressources",
    href: "/15-annexes",
    icon: icons.layers,
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <Head>
        <title>RAG : Architectures Antifragiles : Livre open source</title>
        <meta
          name="description"
          content="Manifeste et guide technique sur les architectures RAG antifragiles, par Fatima-Ezzahra Bouzidi Idrissi."
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              name: "RAG : Architectures Antifragiles pour l'IA Générative",
              author: {
                "@type": "Person",
                name: "Fatima-Ezzahra Bouzidi Idrissi",
              },
              inLanguage: "fr",
              genre: "Technology",
              bookFormat: "EBook",
            }),
          }}
        />
      </Head>

      <section className="home-section home-hero">
        <div className="home-hero-content">
          <div className="home-pill">Open source • Première édition 2025</div>
          <h1 className="home-title">
            RAG : Architectures Antifragiles
            <span>pour l’IA Générative</span>
          </h1>
          <p className="home-subtitle">Manifeste et Guide Technique</p>
          <p className="home-author">Fatima-Ezzahra Bouzidi Idrissi</p>
          <div className="home-cta">
            <Link href="/01-introduction" className="home-btn home-btn-primary">
              Commencer la lecture →
            </Link>
            <a
              className="home-btn home-btn-ghost"
              href="https://github.com/fati54/LivreRAG"
              target="_blank"
              rel="noreferrer"
            >
              Contribuer sur GitHub
            </a>
          </div>
          <p className="home-note">
            Un livre technique pour passer du prototype fragile à
            l’infrastructure robuste.
          </p>
        </div>

        <div className="home-hero-panel" aria-hidden="true">
          <div className="home-hero-card">
            <p className="home-hero-kicker">Pipeline antifragile</p>
            <h3>Ingestion → Retrieval → Génération → Vérification</h3>
            <p>
              Une architecture modulaire, gouvernée et résiliente, conçue pour
              évoluer avec vos risques réels.
            </p>
            <div className="home-hero-badges">
              <span>Traçabilité</span>
              <span>Souveraineté</span>
              <span>Qualité</span>
            </div>
          </div>
          <div className="home-hero-grid">
            <div>
              <strong>15</strong>
              <span>chapitres</span>
            </div>
            <div>
              <strong>20+</strong>
              <span>exemples de code</span>
            </div>
            <div>
              <strong>5</strong>
              <span>cas d’usage</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>open source</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-stats">
        <div className="home-stat">
          <h3>15 chapitres</h3>
          <p>Un parcours complet, de la vision aux architectures terrain.</p>
        </div>
        <div className="home-stat">
          <h3>20+ exemples de code</h3>
          <p>Du pseudo-pipeline au calcul de coût, prêt à être adapté.</p>
        </div>
        <div className="home-stat">
          <h3>5 cas d’usage</h3>
          <p>Santé, droit, industrie, éducation, support client.</p>
        </div>
        <div className="home-stat">
          <h3>Open source</h3>
          <p>Un contenu vivant, amélioré par la communauté.</p>
        </div>
      </section>

      <section className="home-section home-toc">
        <div className="home-section-header">
          <h2>Sommaire visuel</h2>
          <p>Chaque chapitre est conçu comme un module indépendant.</p>
        </div>
        <div className="home-toc-grid">
          {chapters.map((chapter) => (
            <Link
              key={chapter.href}
              href={chapter.href}
              className="home-chapter-card"
            >
              <div className="home-icon">{chapter.icon}</div>
              <div>
                <h3>{chapter.title}</h3>
                <p>{chapter.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-author">
        <div className="home-author-card">
          <div className="home-avatar" aria-hidden="true">
            <span>FE</span>
          </div>
          <div className="home-author-text">
            <h2>À propos de l’auteure</h2>
            <p>
              Tech Lead Data & IA, 8+ ans d’expérience, spécialiste RAG et
              gouvernance. Projets : PedaGen (éducation), Plaide (juridique).
            </p>
            <div className="home-links">
              <a
                href="https://github.com/fati54"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span className="home-link-sep">•</span>
              <a
                href="https://www.linkedin.com/in/fatima-ezzahra-idrissi-bouzidi/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-why">
        <div className="home-section-header">
          <h2>Pourquoi ce livre ?</h2>
          <p>
            Un manifeste technique pour concevoir des systèmes IA crédibles,
            auditables et durables.
          </p>
        </div>
        <div className="home-why-grid">
          <div className="home-why-card">
            <h3>Technique</h3>
            <p>
              Des architectures documentées, des exemples concrets, des
              compromis expliqués sans magie.
            </p>
          </div>
          <div className="home-why-card">
            <h3>Vision</h3>
            <p>
              Sortir du gadget pour construire des systèmes antifragiles,
              souverains, alignés avec le risque réel.
            </p>
          </div>
          <div className="home-why-card">
            <h3>Pratique</h3>
            <p>
              Des patterns actionnables et des checklists pour passer de
              prototype à production.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section home-testimonials">
        <div className="home-section-header">
          <h2>Témoignages</h2>
          <p>Vos retours feront évoluer ce livre.</p>
        </div>
        <div className="home-testimonial-grid">
          <div className="home-testimonial-card">
            <p>
              “Un travail remarquable ; la question des coûts et de la
              fiabilité est enfin traitée.”
            </p>
            <span>: Ariel Shadrac Ouedraogo, doctorant en médecine</span>
          </div>
          <div className="home-testimonial-card">
            <p>
              “La section sur les limites opérationnelles est précieuse,
              rarement détaillée ailleurs.”
            </p>
            <span>: Ariel Shadrac Ouedraogo</span>
          </div>
        </div>
        <p className="home-note">D’autres retours arrivent bientôt.</p>
      </section>

      <section className="home-section home-cta-final" id="newsletter">
        <div className="home-cta-box">
          <div>
            <h2>Prêt·e à commencer ?</h2>
            <p>
              Lancez la lecture, proposez une amélioration ou recevez les
              prochaines mises à jour.
            </p>
          </div>
          <div className="home-cta-actions">
            <Link href="/01-introduction" className="home-btn home-btn-primary">
              Commencer la lecture
            </Link>
            <a
              className="home-btn home-btn-ghost"
              href="https://github.com/fati54/LivreRAG"
              target="_blank"
              rel="noreferrer"
            >
              Suggérer une modification
            </a>
            <button className="home-btn home-btn-outline" type="button">
              S’inscrire aux updates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
