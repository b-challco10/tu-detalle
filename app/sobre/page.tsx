import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  EyeOff,
  HeartHandshake,
  Music,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Sobre TuDetalle | Quiénes somos y cómo funciona",
  description:
    "Conoce TuDetalle: una plataforma para crear dedicatorias y cartas digitales con fotos, música y animaciones, y compartirlas con un enlace.",
  alternates: { canonical: "https://www.tu-detalle.com/sobre" },
};

// ✏️ EDITA: cuenta quién eres. Mostrar quién está detrás da confianza (y a AdSense).
const CREATOR_NAME = "[tu nombre o seudónimo]";

const features = [
  {
    icon: Sparkles,
    title: "Crea en minutos",
    text: "Eliges una plantilla, escribes tu mensaje y listo. No necesitas conocimientos técnicos ni instalar nada.",
  },
  {
    icon: Camera,
    title: "Agrega tus fotos",
    text: "Sube los recuerdos que quieras compartir. Cada plantilla los presenta de una forma distinta: galerías, polaroids o fotos flotantes.",
  },
  {
    icon: Music,
    title: "Añade música",
    text: "Acompaña tu mensaje con la canción que los representa para hacer el momento más emotivo.",
  },
];

const steps = [
  {
    title: "Elige una plantilla",
    text: "Tenemos diseños románticos, navideños y más, con flores, galaxias, cartas con sobre y árboles que florecen al tocarlos.",
  },
  {
    title: "Personaliza tu mensaje",
    text: "Escribe tu dedicatoria, sube las fotos y elige la música. Verás cómo queda antes de compartirlo.",
  },
  {
    title: "Comparte el enlace",
    text: "Se genera un enlace único que puedes enviar por WhatsApp, redes sociales o donde prefieras.",
  },
];

const occasions = [
  "Aniversarios y San Valentín",
  "Cumpleaños",
  "Día de la Madre y del Padre",
  "Navidad y Año Nuevo",
  "Pedir perdón o reconciliarte",
  "Declarar tus sentimientos",
  "Amistades y despedidas",
  "Parejas a distancia",
];

export default function SobrePage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#080810]">
        {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[460px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
          <div className="absolute -left-40 top-[30%] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[130px]" />
          <div className="absolute -right-40 top-[55%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[130px]" />
          <div className="absolute -left-40 bottom-20 h-[360px] w-[360px] rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 md:pt-32">
          {/* Intro */}
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Sobre TuDetalle
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Convierte{" "}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                emociones
              </span>{" "}
              en experiencias
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
              TuDetalle permite crear páginas personalizadas con fotos, mensajes
              y música para sorprender a alguien especial, y compartirlas con un
              simple enlace.
            </p>
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-white">
                    {f.title}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-300">{f.text}</p>
                </div>
              );
            })}
          </div>

          {/* Historia */}
          <section className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-3xl font-bold text-white">
              Por qué creamos TuDetalle
            </h2>
            <div className="glass-card mt-6 space-y-4 p-6 text-lg leading-relaxed text-slate-200 md:p-8">
              <p>
                Muchas veces queremos decirle algo importante a alguien, pero un
                mensaje de texto se queda corto. Una tarjeta impresa llega
                tarde, y los regalos digitales genéricos se sienten fríos.
              </p>
              <p>
                TuDetalle nació para cerrar esa distancia: una forma sencilla de
                convertir tus palabras, tus fotos y tu canción favorita en una
                pequeña experiencia que la otra persona pueda abrir desde su
                celular y guardar para volver a verla.
              </p>
              <p>
                Es un proyecto independiente creado por {CREATOR_NAME}. Lo
                desarrollamos y mejoramos de forma continua, añadiendo nuevas
                plantillas y escuchando las sugerencias de quienes lo usan.
              </p>
            </div>
          </section>

          {/* Cómo funciona */}
          <section className="mt-24">
            <h2 className="text-center text-3xl font-bold text-white">
              Cómo funciona
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="glass-card card-3d relative overflow-hidden p-8 hover:border-cyan-400/40"
                >
                  <span className="absolute right-6 top-4 text-6xl font-bold text-white/[0.07]">
                    0{i + 1}
                  </span>

                  <div className="relative">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-300">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ocasiones */}
          <section className="mx-auto mt-24 max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-white">
              Para qué ocasiones sirve
            </h2>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {occasions.map((o) => (
                <li
                  key={o}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:border-cyan-400/40 hover:text-cyan-200"
                >
                  {o}
                </li>
              ))}
            </ul>
          </section>

          {/* Compromiso */}
          <section className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-3xl font-bold text-white">Nuestro compromiso</h2>

            <ul className="mt-6 space-y-4">
              <li className="glass-card flex gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <EyeOff className="h-5 w-5" />
                </span>
                <p className="text-slate-300">
                  <strong className="text-white">Privacidad:</strong> tu detalle
                  solo lo ve quien tenga el enlace. No aparece en listados
                  públicos ni vendemos tus datos.
                </p>
              </li>

              <li className="glass-card flex gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Trash2 className="h-5 w-5" />
                </span>
                <p className="text-slate-300">
                  <strong className="text-white">Tu contenido es tuyo:</strong>{" "}
                  puedes pedirnos que eliminemos tu detalle cuando quieras.
                </p>
              </li>

              <li className="glass-card flex gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <p className="text-slate-300">
                  <strong className="text-white">Un espacio respetuoso:</strong>{" "}
                  revisamos los reportes y eliminamos el contenido que incumple
                  nuestros{" "}
                  <Link
                    href="/terminos"
                    className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                  >
                    términos
                  </Link>
                  .
                </p>
              </li>
            </ul>

            <p className="mt-6 text-slate-300">
              Más detalles en nuestra{" "}
              <Link
                href="/privacidad"
                className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                política de privacidad
              </Link>
              .
            </p>
          </section>

          {/* Misión + CTA */}
          <div className="glass-card relative mt-24 overflow-hidden p-10 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-emerald-400/20" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-emerald-400/25 blur-[80px]" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white">Nuestra misión</h2>

              <p className="mx-auto mt-4 max-w-3xl text-slate-200">
                Ayudar a las personas a expresar emociones de una manera más
                creativa, moderna y memorable.
              </p>

              <Link
                href="/plantillas"
                className="btn-gradient-animated group mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
              >
                Crear mi detalle
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}