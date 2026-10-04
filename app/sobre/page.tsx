import type { Metadata } from "next";
import Link from "next/link";
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
    icon: "✨",
    title: "Crea en minutos",
    text: "Eliges una plantilla, escribes tu mensaje y listo. No necesitas conocimientos técnicos ni instalar nada.",
  },
  {
    icon: "📸",
    title: "Agrega tus fotos",
    text: "Sube los recuerdos que quieras compartir. Cada plantilla los presenta de una forma distinta: galerías, polaroids o fotos flotantes.",
  },
  {
    icon: "🎵",
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

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-20">
          {/* Intro */}
          <div className="text-center">
            <p className="font-medium text-cyan-400">Sobre TuDetalle</p>

            <h1 className="mt-4 text-5xl font-bold text-white">
              Convierte emociones en experiencias
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
              TuDetalle permite crear páginas personalizadas con fotos, mensajes y
              música para sorprender a alguien especial, y compartirlas con un
              simple enlace.
            </p>
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="text-4xl">{f.icon}</div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {f.title}
                </h2>
                <p className="mt-3 text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Historia */}
          <section className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-3xl font-bold text-white">Por qué creamos TuDetalle</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-300">
              <p>
                Muchas veces queremos decirle algo importante a alguien, pero un
                mensaje de texto se queda corto. Una tarjeta impresa llega tarde, y
                los regalos digitales genéricos se sienten fríos.
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
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
                >
                  <div className="text-sm font-medium text-cyan-400">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-slate-400">{s.text}</p>
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
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-slate-300"
                >
                  {o}
                </li>
              ))}
            </ul>
          </section>

          {/* Compromiso */}
          <section className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-3xl font-bold text-white">Nuestro compromiso</h2>
            <ul className="mt-6 space-y-4 text-lg text-slate-300">
              <li>
                <strong className="text-white">Privacidad:</strong> tu detalle solo
                lo ve quien tenga el enlace. No aparece en listados públicos ni
                vendemos tus datos.
              </li>
              <li>
                <strong className="text-white">Tu contenido es tuyo:</strong> puedes
                pedirnos que eliminemos tu detalle cuando quieras.
              </li>
              <li>
                <strong className="text-white">Un espacio respetuoso:</strong>{" "}
                revisamos los reportes y eliminamos el contenido que incumple
                nuestros{" "}
                <Link href="/terminos" className="text-cyan-300 underline">
                  términos
                </Link>
                .
              </li>
            </ul>
            <p className="mt-6 text-slate-400">
              Más detalles en nuestra{" "}
              <Link href="/privacidad" className="text-cyan-300 underline">
                política de privacidad
              </Link>
              .
            </p>
          </section>

          {/* Misión + CTA */}
          <div className="mt-24 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-10 text-center">
            <h2 className="text-3xl font-bold text-white">Nuestra misión</h2>

            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              Ayudar a las personas a expresar emociones de una manera más
              creativa, moderna y memorable.
            </p>

            <Link
              href="/plantillas"
              className="mt-8 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Crear mi detalle
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}