import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | TuDetalle",
  description:
    "Resuelve tus dudas sobre TuDetalle: cómo crear un detalle, subir fotos y música, compartir el enlace, privacidad y duración.",
  alternates: { canonical: "https://www.tu-detalle.com/faq" },
};

const EMAIL = "bcodex77@gmail.com";

// ⚠️ Revisa que cada respuesta sea cierta para tu plataforma.
// Las marcadas con TODO dependen de cómo funciona tu servicio.
const faqs = [
  {
    question: "¿Qué es TuDetalle?",
    answer:
      "TuDetalle es una plataforma para crear dedicatorias y cartas digitales personalizadas con fotos, música, mensajes y animaciones, y compartirlas con un enlace único.",
  },
  {
    question: "¿Necesito registrarme?",
    answer: "No. Puedes crear tu detalle sin crear una cuenta.",
  },
  {
    // TODO: confirma si es gratis o si hay planes de pago.
    question: "¿Es gratis?",
    answer:
      "Sí, puedes crear tu detalle sin costo. Si en el futuro añadimos funciones opcionales, lo indicaremos claramente antes de que las uses.",
  },
  {
    question: "¿Cómo creo mi detalle?",
    answer:
      "Entra a Plantillas, elige el diseño que más te guste, completa tu mensaje, sube tus fotos y elige la música. Al terminar se genera un enlace que puedes compartir.",
  },
  {
    question: "¿Qué puedo personalizar?",
    answer:
      "Dependiendo de la plantilla, puedes personalizar el título, la dedicatoria, los nombres, las fotos, los colores y la canción. Cada plantilla muestra sus opciones al crearla.",
  },
  {
    question: "¿Cuántas fotos puedo subir?",
    answer:
      "Depende de la plantilla. La mayoría incluye una galería de 4 fotos, y algunas, como la Carta en Sobre, usan 3 fotos estilo polaroid.",
  },
  {
    question: "¿Puedo agregar música?",
    answer:
      "Sí. Puedes añadir una canción para acompañar tu dedicatoria. Recuerda que eres responsable de tener los derechos o permisos para usarla.",
  },
  {
    question: "¿Cómo comparto mi detalle?",
    answer:
      "Al terminar recibes un enlace único. Puedes enviarlo por WhatsApp, mensaje, redes sociales o correo.",
  },
  {
    question: "¿Las páginas son privadas?",
    answer:
      "Solo quienes tengan el enlace podrán acceder. Tu detalle no aparece en listados públicos de TuDetalle. Comparte el enlace solo con quien quieras sorprender.",
  },
  {
    // TODO: debe coincidir con la política de privacidad (constante RETENTION).
    question: "¿Cuánto dura mi detalle?",
    answer:
      "Tu detalle permanece activo mientras esté alojado en la plataforma. Te recomendamos conservar copias de tus fotos y mensajes originales.",
  },
  {
    question: "¿Funciona en celulares?",
    answer:
      "Sí. Se abre desde el navegador de cualquier dispositivo, sin instalar nada. Algunas plantillas con animaciones 3D funcionan mejor en teléfonos y computadoras recientes.",
  },
  {
    question: "¿Cómo elimino mi detalle?",
    answer: `Escríbenos a ${EMAIL} con el enlace de tu detalle y lo eliminaremos.`,
  },
  {
    question: "¿Qué contenido no está permitido?",
    answer:
      "No se permite contenido sexual explícito, violento, que acose o suplante a otras personas, que vulnere la privacidad o que infrinja derechos de autor. Puedes ver la lista completa en nuestros términos y condiciones.",
  },
  {
    question: "Recibí un detalle inapropiado, ¿qué hago?",
    answer: `Escríbenos a ${EMAIL} indicando el enlace. Revisaremos el caso y, si incumple nuestros términos, lo eliminaremos.`,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#080810]">
        {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute -left-32 top-1/2 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-1/4 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-10 md:pt-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Preguntas{" "}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                frecuentes
              </span>
            </h1>

            <p className="mt-4 text-slate-300">
              Todo lo que necesitas saber sobre TuDetalle.
            </p>
          </div>

          <div className="mt-14 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="glass-card group transition duration-300 open:border-cyan-400/30 open:bg-white/[0.08] hover:border-white/25"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-cyan-300 transition-transform duration-300 group-open:rotate-180" />
                </summary>

                <p className="px-5 pb-5 leading-7 text-slate-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-card relative mt-14 overflow-hidden p-8 text-center md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-emerald-400/20" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-emerald-400/25 blur-[80px]" />

            <div className="relative">
              <h2 className="text-2xl font-bold text-white">
                ¿No encontraste tu respuesta?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-200">
                Escríbenos y te ayudamos. También puedes revisar nuestra{" "}
                <Link
                  href="/privacidad"
                  className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  política de privacidad
                </Link>{" "}
                y{" "}
                <Link
                  href="/terminos"
                  className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  términos
                </Link>
                .
              </p>
              <Link
                href="/contacto"
                className="btn-gradient-animated mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" />
                Ir a contacto
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}