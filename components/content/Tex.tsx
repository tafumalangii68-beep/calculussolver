import katex from "katex";

/**
 * Server-rendered math. KaTeX runs at build time, so content pages ship static
 * HTML (plus MathML for screen readers) and no math JavaScript.
 */
export function Tex({ children, display = false, className }: { children: string; display?: boolean; className?: string }) {
  const html = katex.renderToString(children, { displayMode: display, throwOnError: false, output: "htmlAndMathml" });
  if (display) {
    return <div className={`math-scroll ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
