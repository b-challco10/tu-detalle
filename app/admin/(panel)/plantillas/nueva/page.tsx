import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TemplateForm } from "@/components/admin/TemplateForm";

export default function NewTemplatePage() {
  return (
    <div>
      <Link
        href="/admin/plantillas"
        className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Nueva plantilla</h1>

      <div className="mt-8">
        <TemplateForm />
      </div>
    </div>
  );
}
