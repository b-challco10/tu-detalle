import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { adminGetTemplate } from "@/lib/templates/db";
import { TemplateForm } from "@/components/admin/TemplateForm";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await adminGetTemplate(id);

  if (!row) notFound();

  return (
    <div>
      <Link
        href="/admin/plantillas"
        className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Editar: {row.name}</h1>

      <div className="mt-8">
        <TemplateForm
          initial={{
            id: row.id,
            slug: row.slug,
            name: row.name,
            description: row.description ?? "",
            category: row.category ?? "Romántica",
            preview_url: row.preview_url ?? "",
            schema: row.schema ?? [],
            html: row.html ?? "",
            css: row.css ?? "",
            js: row.js ?? "",
            active: row.active,
          }}
        />
      </div>
    </div>
  );
}
