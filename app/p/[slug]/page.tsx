import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ShareBar } from "@/components/public/ShareBar";

// Las dedicatorias son privadas: que Google no las indexe
export const metadata: Metadata = {
  title: "Un detalle para ti | TuDetalle",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicDedicationPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: dedication, error } = await supabase
    .from("dedicatorias")
    .select("id, slug, template_id, content, views, created_at")
    .eq("slug", slug)
    .single();

  if (error || !dedication) {
    notFound();
  }

  const encodedData = encodeContent(dedication.content);

  const templateUrl = `/template/${encodeURIComponent(
    dedication.template_id
  )}?data=${encodeURIComponent(encodedData)}`;

  return (
    // Columna: la plantilla ocupa el espacio que sobra y la barra va DEBAJO,
    // en su propio espacio, sin tapar nada de la plantilla.
    <main className="flex h-dvh w-full flex-col bg-black">
      <iframe
        src={templateUrl}
        title="TuDetalle"
        className="min-h-0 w-full flex-1 border-0"
        sandbox="allow-scripts"
        allow="autoplay"
      />

      <ShareBar />
    </main>
  );
}

function encodeContent(content: unknown) {
  const json = JSON.stringify(content);

  return Buffer.from(json, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}