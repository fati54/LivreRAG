import Giscus from "@giscus/react";

export default function Comments() {
  const repo = "fati54/LivreRAG";
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = "Livre RAG";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repoId || !categoryId) {
    return (
      <div className="giscus-placeholder">
        <p>Commentaires désactivés.</p>
        <p>
          Renseignez <code>NEXT_PUBLIC_GISCUS_REPO_ID</code> et{" "}
          <code>NEXT_PUBLIC_GISCUS_CATEGORY_ID</code> dans Vercel pour activer
          Giscus.
        </p>
      </div>
    );
  }

  return (
    <div className="giscus-wrapper">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="fr"
      />
    </div>
  );
}
