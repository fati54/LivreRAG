import { useEffect, useId, useMemo, useState } from "react";
import { useTheme } from "next-themes";

type MermaidProps = {
  chart: string;
  className?: string;
};

export default function Mermaid({ chart, className }: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const uniqueId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");

  const normalizedChart = useMemo(() => chart.trim(), [chart]);

  useEffect(() => {
    let active = true;

    const render = async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: resolvedTheme === "dark" ? "dark" : "default",
      });

      const { svg: renderedSvg } = await mermaid.render(
        `mermaid-${uniqueId}`,
        normalizedChart
      );

      if (active) {
        setSvg(renderedSvg);
      }
    };

    render();

    return () => {
      active = false;
    };
  }, [normalizedChart, resolvedTheme, uniqueId]);

  return (
    <div
      className={`mermaid-diagram ${className ?? ""}`}
      aria-label="Diagramme Mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
