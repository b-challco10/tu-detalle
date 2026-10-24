// components/layout/Footer.tsx

import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

const columns = [
  {
    title: "Producto",
    links: [
      { href: "/plantillas", label: "Plantillas" },
      { href: "/#como-funciona", label: "Cómo funciona" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/sobre", label: "Sobre" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidad", label: "Privacidad" },
      { href: "/terminos", label: "Términos" },
    ],
  },
];

const linkClass = "text-sm text-slate-300 transition hover:text-cyan-300";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-400/15 bg-[#05050d] px-4 pb-32 pt-12 md:pb-8 md:pt-16">
      {/* Línea de luz superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[300px] w-[300px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <div className="glass-card relative mx-auto max-w-7xl p-6 md:p-10">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </div>

              <span className="text-xl font-bold text-white">
                Tu
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Detalle
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Crea dedicatorias únicas con fotos, música y animaciones
              sorprendentes para compartir con quienes más quieres.
            </p>

            <Link
              href="/plantillas"
              className="btn-gradient-animated group mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.03]"
            >
              Crear mi detalle
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Columnas de enlaces */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} TuDetalle. Todos los derechos
            reservados.
          </p>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Hecho para crear momentos inolvidables</span>
          </div>
        </div>
      </div>
    </footer>
  );
}