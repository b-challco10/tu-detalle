// components/layout/Footer.tsx

import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-cyan-400" />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-xl font-bold text-transparent">
                TuDetalle
              </span>
            </div>

            <p className="mt-3 max-w-md text-sm text-slate-400">
              Crea dedicatorias únicas con fotos, música y animaciones
              sorprendentes para compartir con quienes más quieres.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <Link href="/plantillas" className="transition hover:text-cyan-300">
              Crear detalle
            </Link>

            <Link href="/plantillas" className="transition hover:text-cyan-300">
              Plantillas
            </Link>

            <Link
              href="/#como-funciona"
              className="transition hover:text-cyan-300"
            >
              Cómo funciona
            </Link>
            <Link
              href="/faq"
              className="transition hover:text-cyan-300"
            >
              Preguntas frecuentes
            </Link>
            <Link href="/sobre" className="transition hover:text-cyan-300">
              Sobre
            </Link>

            <Link href="/contacto" className="transition hover:text-cyan-300">
              Contacto
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
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
