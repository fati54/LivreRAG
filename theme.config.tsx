import React from 'react';
import { useRouter } from 'next/router';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 800, fontSize: '1.2em' }}>
      📖 RAG : Architectures Antifragiles
    </span>
  ),
  project: {
    link: 'https://github.com/fati54/LivreRAG',
  },
  docsRepositoryBase: 'https://github.com/fati54/LivreRAG/tree/main',
  footer: {
    text: (
      <span>
        © {new Date().getFullYear()} — <strong>Fatima-Ezzahra Bouzidi Idrissi</strong> — RAG : Architectures Antifragiles pour l'IA Générative
      </span>
    ),
  },
  head: function Head() {
    const { title } = useConfig();
    const router = useRouter();
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    const metaTitle = title
      ? `${title} — RAG Antifragile`
      : "RAG : Architectures Antifragiles pour l'IA Générative";
    const description =
      "RAG : Architectures Antifragiles pour l'IA Générative — Manifeste et Guide Technique par Fatima-Ezzahra Bouzidi Idrissi";
    const url = baseUrl ? `${baseUrl}${router.asPath}` : router.asPath;

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${baseUrl}/favicon.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.svg" />
        <title>{metaTitle}</title>
      </>
    );
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s — RAG Antifragile',
    };
  },
  sidebar: {
    titleComponent({ title, type }) {
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    title: 'Sur cette page',
    backToTop: true,
  },
  editLink: {
    text: '✏️ Modifier cette page sur GitHub',
  },
  feedback: {
    content: '💬 Une question ? Ouvrir une issue',
    labels: 'feedback',
  },
  navigation: {
    prev: true,
    next: true,
  },
  primaryHue: 210,
  primarySaturation: 80,
  darkMode: true,
  nextThemes: {
    defaultTheme: 'light',
  },
};

export default config;
