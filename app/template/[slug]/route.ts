import { NextResponse } from "next/server";
import { templates } from "@/lib/templates/registry";
import { loadTemplate } from "@/lib/templates/loader";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

function decodeData(encoded: string | null): Record<string, string> {
  if (!encoded) {
    return {};
  }

  if (encoded.length > 250_000) {
    return {};
  }

  try {
    const normalized = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      normalized +
      "=".repeat((4 - (normalized.length % 4)) % 4);

    const json = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(json);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function safeJson(value: Record<string, string>) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildHtml(
  html: string,
  css: string,
  js: string,
  data: Record<string, string>
) {
  const dataScript = `
<script>
window.__TUDETALLE_DATA__ = ${safeJson(data)};
</script>
`;

  const styleTag = `
<style>
${css}
</style>
`;

  const scriptTag = `
<script type="module">
${js}
</script>
`;

  let result = html;

  result = result.replace(
    "</head>",
    `${styleTag}</head>`
  );

  result = result.replace(
    "</body>",
    `${dataScript}${scriptTag}</body>`
  );

  return result;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  const template = templates.find(
    (item) => item.slug === slug
  );

  if (!template) {
    return new NextResponse(
      "<h1>Plantilla no encontrada</h1>",
      {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }

  try {
    const { html, css, js } = await loadTemplate(template);

    const url = new URL(request.url);
    const encodedData = url.searchParams.get("data");

    const data = decodeData(encodedData);

    const finalHtml = buildHtml(
      html,
      css,
      js,
      data
    );

    return new NextResponse(finalHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Error cargando plantilla:",
      error
    );

    return new NextResponse(
      "<h1>Error al cargar la plantilla</h1>",
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }
}