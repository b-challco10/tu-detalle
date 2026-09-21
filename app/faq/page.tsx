import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const faqs = [
  {
    question: "¿Necesito registrarme?",
    answer:
      "No. Puedes crear tu detalle sin crear una cuenta.",
  },
  {
    question: "¿Puedo subir mis propias fotos?",
    answer:
      "Sí. Puedes añadir imágenes personalizadas.",
  },
  {
    question: "¿Puedo agregar música?",
    answer:
      "Sí. Puedes subir una canción para acompañar tu dedicatoria.",
  },
  {
    question: "¿Las páginas son privadas?",
    answer:
      "Solo quienes tengan el enlace podrán acceder.",
  },
  {
    question: "¿Cuánto dura mi detalle?",
    answer:
      "Actualmente permanece activo mientras esté alojado en la plataforma.",
  },
];

export default function FAQPage() {
  return (
    <>
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

                <p className="mt-4 text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}