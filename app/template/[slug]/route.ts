import { NextResponse } from "next/server";
import { getTemplateSource } from "@/lib/templates/all";
import { buildTemplateHtml } from "@/lib/templates/build-html";

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
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");

    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    const json = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(json);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

const htmlHeaders = {
  "Content-Type": "text/html; charset=utf-8",
};

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;

  try {
    // Busca primero en la carpeta /templates y después en la base de datos
    const source = await getTemplateSource(slug);

    if (!source) {
      return new NextResponse("<h1>Plantilla no encontrada</h1>", {
        status: 404,
        headers: htmlHeaders,
      });
    }

    const url = new URL(request.url);
    const data = decodeData(url.searchParams.get("data"));

    const finalHtml = buildTemplateHtml(
      source.html,
      source.css,
      source.js,
      data
    );

    return new NextResponse(finalHtml, {
      status: 200,
      headers: {
        ...htmlHeaders,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error cargando plantilla:", error);

    return new NextResponse("<h1>Error al cargar la plantilla</h1>", {
      status: 500,
      headers: htmlHeaders,
    });
  }
}
