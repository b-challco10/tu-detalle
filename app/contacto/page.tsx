import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contacto | TuDetalle",
  description:
    "Escríbenos para consultas, sugerencias, reportar errores o contenido, o pedir la eliminación de tu detalle.",
  alternates: { canonical: "https://www.tu-detalle.com/contacto" },
};

const EMAIL = "bcodex77@gmail.com";

const reasons = [
  {
    icon: "💡",
    title: "Sugerencias",
    text: "¿Quieres una plantilla nueva o una función? Cuéntanos tu idea, siempre estamos abiertos a mejorar.",
  },
  {
    icon: "🐛",
    title: "Reportar errores",
    text: "Si algo no funciona, indícanos qué plantilla usabas, qué pasó y desde qué dispositivo y navegador. Una captura de pantalla ayuda mucho.",
  },
  {
    icon: "🗑️",
    title: "Eliminar mi detalle",
    text: "Envíanos el enlace de tu detalle y lo eliminaremos junto con tus fotos y mensajes.",
  },
  {
    icon: "🚩",
    title: "Reportar contenido",
    text: "Si encontraste un detalle que incumple nuestras normas o vulnera tus derechos, envíanos el enlace y lo revisaremos.",
  },
  {
    icon: "©️",
    title: "Derechos de autor",
    text: "Si eres titular de derechos y crees que un detalle usa tu obra sin permiso, escríbenos con el enlace y una prueba de titularidad.",
  },
  {
    icon: "📄",
    title: "Datos personales",
    text: "Para consultar, corregir o eliminar tus datos, escríbenos indicando tu solicitud.",
  },
];

export default function ContactoPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">Contáctanos</h1>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              ¿Tienes preguntas, sugerencias o algún problema? Escríbenos y
              te ayudaremos.
            </p>
          </div>

          {/* Correo principal */}
          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-10 text-center">
            <div className="text-4xl">📧</div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              Escríbenos por correo
            </h2>

            <a
              href={`mailto:${EMAIL}`}
              className="mt-3 inline-block text-2xl font-semibold text-cyan-300 underline"
            >
              {EMAIL}
            </a>

            {/* TODO: ajusta el plazo a lo que realmente puedas cumplir */}
            <p className="mt-4 text-slate-400">
              Respondemos normalmente en un plazo de 48 a 72 horas.
            </p>
          </div>

          {/* Motivos */}
          <h2 className="mt-20 text-center text-3xl font-bold text-white">
            ¿En qué podemos ayudarte?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
              >
                <div className="text-4xl">{r.icon}</div>

                <h3 className="mt-4 text-xl font-semibold text-white">
                  {r.title}
                </h3>

                <p className="mt-3 text-slate-400">{r.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-center text-slate-400">
            Antes de escribir, puede que tu duda ya esté resuelta en las{" "}
            <Link href="/faq" className="text-cyan-300 underline">
              preguntas frecuentes
            </Link>
            . Consulta también la{" "}
            <Link href="/privacidad" className="text-cyan-300 underline">
              política de privacidad
            </Link>{" "}
            y los{" "}
            <Link href="/terminos" className="text-cyan-300 underline">
              términos y condiciones
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}