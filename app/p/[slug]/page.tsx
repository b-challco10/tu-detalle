import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ShareBar } from "@/components/public/ShareBar";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicDedicationPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: dedication,
    error,
  } = await supabase
    .from("dedicatorias")
    .select(
      "id, slug, template_id, content, views, created_at"
    )
    .eq("slug", slug)
    .single();

  if (error || !dedication) {
    notFound();
  }

  const encodedData =
    encodeContent(
      dedication.content
    );

  const templateUrl =
    `/template/${encodeURIComponent(
      dedication.template_id
    )}?data=${encodeURIComponent(
      encodedData
    )}`;

  return (
    <main className="min-h-screen bg-slate-950">
      <iframe
        src={templateUrl}
        title="TuDetalle"
        className="h-screen w-full border-0"
        allow="autoplay"
      />
      <ShareBar />
    </main>
  );
}

function encodeContent(
  content: unknown
) {
  const json =
    JSON.stringify(content);

  return Buffer.from(
    json,
    "utf8"
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}