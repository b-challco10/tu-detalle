import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllTemplates } from "@/lib/templates/all";
import { getCreatedLabel } from "@/lib/stats";

import { StatsPills } from "@/components/templates/StatsPills";
import { TemplateBrowser } from "@/components/templates/TemplateBrowser";

export const revalidate = 60;

export default async function PlantillasPage() {
  const [templates, createdLabel] = await Promise.all([
    getAllTemplates(),
    getCreatedLabel(),
  ]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080810]">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 md:pt-32">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white">Plantillas</h1>

            <p className="mt-4 text-slate-300">
              Escoge una plantilla y crea tu detalle personalizado.
            </p>

            <StatsPills
              templateCount={templates.length}
              createdLabel={createdLabel}
            />
          </div>

          <TemplateBrowser templates={templates} />
        </div>
      </main>

      <Footer />
    </>
  );
}