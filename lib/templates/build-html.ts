/**
 * Funciones puras (sin node:fs) para armar el HTML final de una plantilla.
 * Se usan en el servidor (/template/[slug]) y en la vista previa del panel.
 */

export function safeJson(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildTemplateHtml(
  html: string,
  css: string,
  js: string,
  data: Record<string, string>
) {
  // Las plantillas traen <link href="style.css"> y <script src="script.js">,
  // pero aquí el CSS y el JS se inyectan solos: los quitamos para evitar 404.
  let result = html
    .replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, "")
    .replace(/<script[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/gi, "");

  const dataScript = `<script>window.__TUDETALLE_DATA__ = ${safeJson(data)};</script>`;
  const styleTag = `<style>\n${css}\n</style>`;
  const scriptTag = `<script type="module">\n${js.replace(
    /<\/script/gi,
    "<\\/script"
  )}\n</script>`;

  // Se usan funciones en replace() para que símbolos como $& o $$ del código
  // de la plantilla no se interpreten como patrones especiales.
  result = result.includes("</head>")
    ? result.replace("</head>", () => `${styleTag}</head>`)
    : `${styleTag}${result}`;

  result = result.includes("</body>")
    ? result.replace("</body>", () => `${dataScript}${scriptTag}</body>`)
    : `${result}${dataScript}${scriptTag}`;

  return result;
}
