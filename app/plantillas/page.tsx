import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { templates } from "@/lib/templates/registry";

import { TemplateGrid } from "@/components/templates/TemplateGrid";

export default function PlantillasPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080810]">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 md:pt-32">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white">
              Plantillas
            </h1>

            <p className="mt-4 text-slate-400">
              Escoge una plantilla y crea tu
              detalle personalizado.
            </p>
          </div>

          <TemplateGrid templates={templates} />
        </div>
      </main>

      <Footer />
    </>
  );
}