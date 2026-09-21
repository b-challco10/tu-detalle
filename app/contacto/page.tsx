import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ContactoPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              Contáctanos
            </h1>

            <p className="mt-4 text-slate-400">
              ¿Tienes preguntas o sugerencias?
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">📧</div>

              <h3 className="mt-4 text-xl font-semibold text-white">
                Correo
              </h3>

              <p className="mt-3 text-slate-400">
                brayanchallco28@gmail.com
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">💡</div>

              <h3 className="mt-4 text-xl font-semibold text-white">
                Sugerencias
              </h3>

              <p className="mt-3 text-slate-400">
                Siempre estamos abiertos a nuevas ideas.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">🐛</div>

              <h3 className="mt-4 text-xl font-semibold text-white">
                Reportar errores
              </h3>

              <p className="mt-3 text-slate-400">
                Ayúdanos a mejorar TuDetalle.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}