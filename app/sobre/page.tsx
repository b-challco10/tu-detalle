import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SobrePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-20">
          <div className="text-center">
            <p className="text-cyan-400 font-medium">
              SOBRE TUDETALLE
            </p>

            <h1 className="mt-4 text-5xl font-bold text-white">
              Convierte emociones en experiencias
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
              TuDetalle permite crear páginas personalizadas
              con fotos, mensajes y música para sorprender
              a alguien especial.
            </p>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">✨</div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Crea en minutos
              </h3>
              <p className="mt-3 text-slate-400">
                Diseña una dedicatoria única sin conocimientos
                técnicos.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">📸</div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Agrega tus fotos
              </h3>
              <p className="mt-3 text-slate-400">
                Comparte recuerdos especiales mediante
                imágenes personalizadas.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl">🎵</div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Añade música
              </h3>
              <p className="mt-3 text-slate-400">
                Haz que la experiencia sea aún más emotiva.
              </p>
            </div>
          </div>

          <div className="mt-24 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-10 text-center">
            <h2 className="text-3xl font-bold text-white">
              Nuestra misión
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              Ayudar a las personas a expresar emociones de
              una manera más creativa, moderna y memorable.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}