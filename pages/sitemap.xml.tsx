const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const paths = [
  "/",
  "/01-introduction",
  "/02-pourquoi-rag",
  "/03-comparaison-approches",
  "/04-principes-cles",
  "/05-architecture-detaillee",
  "/06-anatomie-pipeline",
  "/07-modularite-vs-frameworks",
  "/08-securite-gouvernance",
  "/09-extensions-pipeline",
  "/10-cas-usages",
  "/11-comparaison-alternatives",
  "/12-limites-defis",
  "/13-conclusion",
  "/14-getting-started",
  "/15-annexes",
];

export async function getServerSideProps({ res }) {
  const baseUrl = getBaseUrl();
  const lastMod = new Date().toISOString();

  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastMod}</lastmod>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
