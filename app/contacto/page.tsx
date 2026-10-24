import type { Metadata } from "next";
import Link from "next/link";
import {
  Bug,
  Copyright,
  FileText,
  Flag,
  Lightbulb,
  Mail,
  Send,
  Trash2,
} from "lucide-react";
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
    icon: Lightbulb,
    title: "Sugerencias",
    text: "¿Quieres una plantilla nueva o una función? Cuéntanos tu idea, siempre estamos abiertos a mejorar.",
  },
  {
    icon: Bug,
    title: "Reportar errores",
    text: "Si algo no funciona, indícanos qué plantilla usabas, qué pasó y desde qué dispositivo y navegador. Una captura de pantalla ayuda mucho.",
  },
  {
    icon: Trash2,
    title: "Eliminar mi detalle",
    text: "Envíanos el enlace de tu detalle y lo eliminaremos junto con tus fotos y mensajes.",
  },
  {
    icon: Flag,
    title: "Reportar contenido",
    text: "Si encontraste un detalle que incumple nuestras normas o vulnera tus derechos, envíanos el enlace y lo revisaremos.",
  },
  {
    icon: Copyright,
    title: "Derechos de autor",
    text: "Si eres titular de derechos y crees que un detalle usa tu obra sin permiso, escríbenos con el enlace y una prueba de titularidad.",
  },
  {
    icon: FileText,
    title: "Datos personales",
    text: "Para consultar, corregir o eliminar tus datos, escríbenos indicando tu solicitud.",
  },
];

export default function ContactoPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#080810]">
        {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[460px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
          <div className="absolute -left-40 top-[45%] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[130px]" />
          <div className="absolute -right-40 top-[60%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 md:pt-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Contáctanos
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              ¿Tienes preguntas, sugerencias o algún problema? Escríbenos y te
              ayudaremos.
            </p>
          </div>

          {/* Correo principal */}
          <div className="glass-card relative mx-auto mt-14 max-w-2xl overflow-hidden p-8 text-center md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-emerald-400/20" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-emerald-400/25 blur-[80px]" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 text-white shadow-[0_0_35px_rgba(34,211,238,0.4)]">
                <Mail className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Escríbenos por correo
              </h2>

              <a
                href={`mailto:${EMAIL}`}
                className="mt-3 inline-block break-all text-xl font-semibold text-cyan-300 underline-offset-4 transition hover:text-cyan-200 hover:underline sm:text-2xl"
              >
                {EMAIL}
              </a>

              <div className="mt-6">
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn-gradient-animated inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
                >
                  <Send className="h-4 w-4" />
                  Enviar correo
                </a>
              </div>

              {/* TODO: ajusta el plazo a lo que realmente puedas cumplir */}
              <p className="mt-5 text-sm text-slate-300">
                Respondemos normalmente en un plazo de 48 a 72 horas.
              </p>
            </div>
          </div>

          {/* Motivos */}
          <h2 className="mt-20 text-center text-3xl font-bold text-white">
            ¿En qué podemos ayudarte?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="glass-card p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_40px_rgba(34,211,238,0.15)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {r.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-300">{r.text}</p>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-14 max-w-3xl text-center leading-7 text-slate-300">
            Antes de escribir, puede que tu duda ya esté resuelta en las{" "}
            <Link
              href="/faq"
              className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
            >
              preguntas frecuentes
            </Link>
            . Consulta también la{" "}
            <Link
              href="/privacidad"
              className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
            >
              política de privacidad
            </Link>{" "}
            y los{" "}
            <Link
              href="/terminos"
              className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
            >
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