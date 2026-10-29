import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  Image as ImageIcon,
  Music,
  Sparkles,
  WandSparkles,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { getAllTemplates } from "@/lib/templates/all"; 
import { StatsShowcase, type StatItem } from "@/components/home/StatsShowcase";
import { getCreatedRounded } from "@/lib/stats";
export const revalidate = 60;
export default async function Home() {                    // ahora async
  const [templates, createdValue] = await Promise.all([
  getAllTemplates(),
  getCreatedRounded(),
]);

const categoriesCount = new Set(templates.map((t) => t.category)).size;

const stats: StatItem[] = [
  ...(createdValue
    ? [{ icon: "created" as const, value: createdValue, prefix: "+", label: "detalles creados" }]
    : []),
  {
    icon: "templates",
    value: templates.length,
    label: templates.length === 1 ? "plantilla para elegir" : "plantillas para elegir",
  },
  {
    icon: "categories",
    value: categoriesCount,
    label: categoriesCount === 1 ? "ocasión" : "ocasiones y estilos",
  },
];
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#080810] text-white">
        {/* ================= HERO ================= */}
        <section className="relative flex items-center px-4 pb-20 pt-16 sm:px-6 md:min-h-screen md:pt-32 lg:px-8">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[140px]" />
            <div className="absolute -left-40 top-1/2 h-[350px] w-[350px] rounded-full bg-cyan-400/15 blur-[120px]" />
            <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-400/15 blur-[120px]" />
          </div>

          {/* Stars */}
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:45px_45px]" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md">
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

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg lg:mx-0">
                Plataforma interactiva en línea para crear dedicatorias personalizadas con fotografías, música de fondo, mensajes emotivos y animaciones. Comparte un enlace único y sorprende a esa persona especial en su día.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/plantillas"
                  className="btn-gradient-animated group flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:scale-[1.03]"
                >
                  Crear mi dedicatoria
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <a
                  href="#como-funciona"
                  className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-center font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:bg-white/[0.1]"
                >
                  ¿Cómo funciona?
                </a>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-200 lg:justify-start">
                {["Sin complicaciones", "Comparte por enlace", "100% Personalizable"].map((text) => (
                  <span
                    key={text}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-md"
                  >
                    <Check className="h-4 w-4 text-emerald-400" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT - VISUAL */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-blue-600/25 via-cyan-400/25 to-emerald-400/25 blur-3xl" />

              {/* Marco de vidrio */}
              <div className="relative rounded-[32px] border border-white/15 bg-white/[0.06] p-3 shadow-[0_0_60px_rgba(56,189,248,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl">
                <div className="overflow-hidden rounded-[25px] border border-white/10 bg-[#080810]/80">
                  {/* barra del navegador */}
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  </div>

                  <div className="relative px-6 py-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 via-transparent to-emerald-500/15" />

                    <div className="relative">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                        <Heart
                          className="h-10 w-10 text-white"
                          fill="currentColor"
                        />
                      </div>

                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        Una dedicatoria especial
                      </p>

                      <h2 className="mt-4 text-3xl font-bold">
                        Para alguien especial
                      </h2>

                      <div className="mx-auto mt-6 h-40 w-40 overflow-hidden rounded-full border-4 border-white/10 bg-gradient-to-br from-blue-500/25 to-emerald-500/25">
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-cyan-300/70" />
                        </div>
                      </div>

                      <p className="mx-auto mt-7 max-w-xs text-sm leading-7 text-slate-300">
                        Hay personas que llegan a nuestra vida y hacen que todo sea un poquito más bonito.
                      </p>

                      <div className="mt-6 text-sm text-slate-400">
                        Con cariño ♥
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating music */}
              <div className="absolute -right-3 top-20 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-white/[0.08] text-cyan-200 shadow-[0_8px_30px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:-right-6">
                <Music className="h-5 w-5" />
              </div>

              {/* floating spark */}
              <div className="absolute -left-3 bottom-24 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-white/[0.08] text-emerald-200 shadow-[0_8px_30px_rgba(52,211,153,0.25)] backdrop-blur-xl sm:-left-6">
                <WandSparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>
{/* ESTADÍSTICAS */}
<section className="relative px-4 pb-6 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl">
    <StatsShowcase items={stats} />
  </div>
</section>
        {/* ================= PLANTILLAS ================= */}
        <section
          id="plantillas"
          className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24"
        >
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Plantillas
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Elige tu{" "}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                diseño favorito
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-slate-300">
              Cada plantilla incluye animaciones interactivas, música personalizada, marcos de fotografías y efectos visuales diseñados para emocionar.
            </p>
          </div>

          <TemplateGrid templates={templates} />
        </section>

        {/* ================= COMO FUNCIONA ================= */}
        <section
          id="como-funciona"
          className="relative scroll-mt-24 border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-1/3 h-[320px] w-[320px] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute right-1/4 bottom-0 h-[320px] w-[320px] rounded-full bg-emerald-400/15 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Así de fácil
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Crea tu detalle en minutos
              </h2>

              <p className="mt-4 text-slate-300">
                Nosotros ponemos la tecnología digital y los componentes interactivos. Tú pones los recuerdos, las fotografías y el sentimiento.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <Step
                number="01"
                icon={<WandSparkles className="h-6 w-6" />}
                title="Elige una plantilla"
                description="Selecciona uno de nuestros diseños animados pensados para aniversarios, cumpleaños, declaraciones de amor o agradecimientos especiales."
              />

              <Step
                number="02"
                icon={<Heart className="h-6 w-6" />}
                title="Personalízala a tu gusto"
                description="Añade tus propias palabras, carga tus fotografías favoritas, selecciona colores y elige una canción que signifique mucho para ambos."
              />

              <Step
                number="03"
                icon={<ArrowRight className="h-6 w-6" />}
                title="Comparte el enlace único"
                description="Genera un enlace web personalizado al instante y envíaselo por WhatsApp, redes sociales o correo electrónico a esa persona especial."
              />
            </div>
          </div>
        </section>

        {/* ================= SECCIÓN DE CONTENIDO INFORMATIVO (NUEVO PARA ADSENSE) ================= */}
        <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8 bg-black/20">
          <div className="relative mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Guía y Propósito
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                ¿Por qué regalar una dedicatoria digital en Tu Detalle?
              </h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                En la era digital, los detalles que trascienden son aquellos que combinan la tecnología con la emoción sincera. Nuestra misión es ayudarte a estrechar distancias y conmover corazones.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 text-slate-300 text-sm leading-relaxed">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Innovación en cada mensaje
                </h3>
                <p>
                  A diferencia de una tarjeta de papel tradicional o un mensaje de texto común, <strong>Tu Detalle</strong> transforma tus sentimientos en una experiencia web inmersiva. Al integrar animaciones fluidas, música de fondo y galerías fotográficas en una sola vista optimizada para celulares y computadoras, garantizamos que el impacto emocional sea inolvidable y perdure en el tiempo mediante un enlace web privado.
                </p>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Privacidad y facilidad de uso
                </h3>
                <p>
                  Diseñamos nuestra plataforma priorizando la simplicidad técnica. No necesitas conocimientos de programación ni diseño gráfico avanzado. En menos de cinco minutos, cualquier usuario puede configurar su plantilla, verificar una vista previa en tiempo real y obtener una URL lista para compartir con total seguridad y confianza.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[360px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              <Feature
                icon={<Heart />}
                title="Hecho con sentimiento"
                description="Cada detalle está estructurado para que puedas expresar con total libertad lo que llevas en el corazón."
              />

              <Feature
                icon={<ImageIcon />}
                title="Tus mejores recuerdos"
                description="Sube tus fotografías entrañables y conviértelas en el eje central de una experiencia digital interactiva."
              />

              <Feature
                icon={<Music />}
                title="La canción perfecta"
                description="Acompaña las palabras y las imágenes con una pista musical para evocar recuerdos y emociones únicas."
              />
            </div>
          </div>
        </section>

        {/* ================= PREGUNTAS FRECUENTES (FAQ - VITAL PARA ADSENSE) ================= */}
        <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 mb-4">
                <HelpCircle className="h-4 w-4" />
                Resolvemos tus dudas
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Preguntas Frecuentes</h2>
              <p className="mt-3 text-slate-300">
                Todo lo que necesitas saber sobre la creación y compartición de tus dedicatorias en línea.
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-semibold text-white text-base">¿Cómo se comparte la dedicatoria con esa persona especial?</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Una vez que personalices y guardes tu dedicatoria, el sistema te proporcionará un enlace web único (URL). Puedes copiarlo y enviárselo por WhatsApp, Messenger, correo electrónico o cualquier red social de tu preferencia.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-semibold text-white text-base">¿Las plantillas incluyen música y animaciones interactivas?</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Sí, todas nuestras plantillas base vienen integradas con efectos de animación fluidos, marcos estéticos y la opción de configurar elementos multimedia para que la experiencia del usuario sea completamente envolvente.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-semibold text-white text-base">¿Puedo utilizar mis propias fotografías y textos personalizados?</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  ¡Por supuesto! La plataforma está diseñada para que puedas redactar tus propios mensajes personalizados, cambiar títulos y subir las imágenes que prefieras desde tu computadora o teléfono móvil.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-semibold text-white text-base">¿Cuánto tiempo permanece activo el enlace de la dedicatoria?</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Los enlaces generados se mantienen activos en nuestros servidores de manera continua para que esa persona especial pueda ingresar a revivir el momento cuantas veces lo desee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="glass-card relative mx-auto max-w-5xl overflow-hidden px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-emerald-400/20" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-emerald-400/25 blur-[90px]" />

            <div className="relative">
              <p className="text-sm font-semibold text-cyan-200">
                Tu historia merece un detalle especial
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                ¿A quién quieres sorprender hoy?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-200">
                Crea ahora una dedicatoria personalizada y conviértela en un recuerdo digital que podrá guardar y atesorar para siempre.
              </p>

              <Link
                href="/plantillas"
                className="btn-gradient-animated group mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
              >
                Crear mi detalle ✨
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
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
    <div className="glass-card card-3d group relative overflow-hidden p-7 hover:border-cyan-400/40">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
          {icon}
        </div>

        <span className="text-5xl font-bold text-white/10">{number}</span>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
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
    <div className="glass-card group p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}