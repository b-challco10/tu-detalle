import { DedicationEditor } from "@/components/editor/DedicationEditor";
import { templates } from "@/lib/templates/registry";
import {Navbar} from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
export default function CrearPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-12">
          <div className="mb-10">
            <p className="text-sm font-medium text-cyan-400">
              TuDetalle
            </p>

            <h1 className="mt-2 text-4xl font-bold text-white">
              Crea tu dedicatoria
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Elige una plantilla, personalízala y comparte tu detalle
              con alguien especial.
            </p>
          </div>

          <DedicationEditor templates={templates} />
        </div>

        <Footer />
      </main>
    </>
  );
}