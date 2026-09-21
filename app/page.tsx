import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Image,
  Music,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { templates } from "@/lib/templates/registry";
export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

          <div className="absolute -left-40 top-1/2 h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-[120px]" />

          <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />
        </div>

        {/* Stars */}
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:45px_45px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
          
          {/* LEFT */}
          <div className="text-center lg:text-left">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Crea algo que nunca olvidará
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Convierte tus
              <br />

              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                sentimientos
              </span>

              <br />

              en un detalle.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg lg:mx-0">
              Crea una dedicatoria personalizada con fotos, música,
              mensajes y animaciones. Comparte un enlace y sorprende
              a esa persona especial.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/plantillas"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-6 py-3.5 font-semibold shadow-[0_0_30px_rgba(34,211,238,0.2)] transition hover:scale-[1.03]"
              >
                Crear mi dedicatoria

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#como-funciona"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/[0.06]"
              >
                ¿Cómo funciona?
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-slate-500 lg:justify-start">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Sin complicaciones
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Comparte por enlace
              </span>
            </div>
          </div>

          {/* RIGHT - VISUAL */}
          <div className="relative mx-auto w-full max-w-md">
            
            <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-400/20 to-emerald-400/20 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/10 bg-slate-900/70 p-3 shadow-[0_0_60px_rgba(56,189,248,0.15)] backdrop-blur-xl">
              
              <div className="overflow-hidden rounded-[25px] border border-white/10 bg-slate-950">
                
                {/* fake browser/header */}
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                </div>

                <div className="relative px-6 py-12 text-center">
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-emerald-500/10" />

                  <div className="relative">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
                      <Heart
                        className="h-10 w-10 text-white"
                        fill="currentColor"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      Una dedicatoria especial
                    </p>

                    <h2 className="mt-4 text-3xl font-bold">
                      Para alguien especial
                    </h2>

                    <div className="mx-auto mt-6 h-40 w-40 overflow-hidden rounded-full border-4 border-slate-800 bg-gradient-to-br from-blue-500/20 to-emerald-500/20">
                      <div className="flex h-full items-center justify-center">
                        <Image className="h-10 w-10 text-cyan-400/60" />
                      </div>
                    </div>

                    <p className="mx-auto mt-7 max-w-xs text-sm leading-7 text-slate-400">
                      Hay personas que llegan a nuestra vida y
                      hacen que todo sea un poquito más bonito.
                    </p>

                    <div className="mt-6 text-sm text-slate-500">
                      Con cariño ♥
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* floating music */}
            <div className="absolute -right-3 top-20 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900/90 text-cyan-300 shadow-lg backdrop-blur-xl sm:-right-6">
              <Music className="h-5 w-5" />
            </div>

            {/* floating spark */}
            <div className="absolute -left-3 bottom-24 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-900/90 text-emerald-300 shadow-lg backdrop-blur-xl sm:-left-6">
              <WandSparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>
<section
  id="plantillas"
  className="mx-auto max-w-7xl px-4 py-24"
>
  <div className="mb-12">
    <p className="text-sm font-medium text-cyan-400">
      PLANTILLAS
    </p>

    <h2 className="mt-2 text-4xl font-bold text-white">
      Elige tu diseño favorito
    </h2>

    <p className="mt-4 text-slate-400">
      Cada plantilla incluye animaciones,
      música, imágenes y efectos visuales.
    </p>
  </div>

  <TemplateGrid templates={templates} />
</section>
      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Así de fácil
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Crea tu detalle en minutos
            </h2>

            <p className="mt-4 text-slate-400">
              Nosotros ponemos la tecnología. Tú pones el sentimiento.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            
            <Step
              number="01"
              icon={<WandSparkles className="h-6 w-6" />}
              title="Elige una plantilla"
              description="Selecciona uno de nuestros diseños animados para comenzar."
            />

            <Step
              number="02"
              icon={<Heart className="h-6 w-6" />}
              title="Personalízala"
              description="Añade tu mensaje, fotos, colores y la canción que quieras."
            />

            <Step
              number="03"
              icon={<ArrowRight className="h-6 w-6" />}
              title="Comparte"
              description="Genera un enlace único y envíaselo a esa persona especial."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              icon={<Heart />}
              title="Hecho con sentimiento"
              description="Cada detalle está pensado para que puedas expresar lo que sientes."
            />

            <Feature
              icon={<Image />}
              title="Tus mejores recuerdos"
              description="Sube tus fotografías y conviértelas en parte de una experiencia especial."
            />

            <Feature
              icon={<Music />}
              title="La canción perfecta"
              description="Añade una canción para crear una experiencia todavía más personal."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-16 text-center backdrop-blur-xl sm:px-12">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-400/10 to-emerald-400/10" />

          <div className="relative">
            <p className="text-sm font-semibold text-cyan-300">
              Tu historia merece un detalle especial
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              ¿A quién quieres sorprender?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Crea ahora una dedicatoria personalizada y
              conviértela en un recuerdo que podrá guardar para siempre.
            </p>

            <Link
              href="/plantillas"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-7 py-3.5 font-semibold shadow-lg shadow-cyan-500/20 transition hover:scale-[1.03]"
            >
              Crear mi detalle ✨
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
<Footer />
    </main>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-slate-900/50 p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 via-cyan-400/20 to-emerald-400/20 text-cyan-300">
          {icon}
        </div>

        <span className="text-4xl font-bold text-white/5">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 via-cyan-400/20 to-emerald-400/20 text-cyan-300">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}