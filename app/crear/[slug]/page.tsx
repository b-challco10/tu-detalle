import { notFound } from "next/navigation";

import { DedicationEditor } from "@/components/editor/DedicationEditor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { templates } from "@/lib/templates/registry";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CrearTemplatePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const template = templates.find(
    (item) => item.slug === slug
  );

  if (!template) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-12">
          <div className="mb-10">
            <p className="text-sm font-medium text-cyan-400">
              {template.category}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              {template.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              {template.description}
            </p>
          </div>

          <DedicationEditor
            templates={[template]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}