import type { Metadata } from "next";
import Link from "next/link";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              Preguntas frecuentes
            </h1>

            <p className="mt-4 text-slate-400">
              Todo lo que necesitas saber sobre TuDetalle.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer font-semibold text-white">
                  {faq.question}
                </summary>

                <p className="mt-4 text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="mt-3 text-slate-300">
              Escríbenos y te ayudamos. También puedes revisar nuestra{" "}
              <Link href="/privacidad" className="text-cyan-300 underline">
                política de privacidad
              </Link>{" "}
              y{" "}
              <Link href="/terminos" className="text-cyan-300 underline">
                términos
              </Link>
              .
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Ir a contacto
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}