"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface TemplateFrameProps {
  src: string;
  title?: string;
  /** Alto del contenedor, p. ej. "h-screen" o "h-[720px]" */
  heightClassName?: string;
  label?: string;
}

export function TemplateFrame({
  src,
  title = "TuDetalle",
  heightClassName = "h-screen",
  label = "Preparando tu sorpresa ✨",
}: TemplateFrameProps) {
  // Guardamos QUÉ src terminó de cargar. Si el src cambia, "loaded" vuelve
  // a ser false solo, sin efectos ni resets manuales.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  return (
    <div className={`relative w-full overflow-hidden bg-[#080810] ${heightClassName}`}>
      {/* Pantalla de carga */}
      <div
        role="status"
        aria-live="polite"
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#080810]/90 backdrop-blur-sm transition-opacity duration-500 ${
          loaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0%,#2563eb_30%,#22d3ee_65%,#34d399_100%)] motion-reduce:animate-none" />
          <div className="absolute inset-[3px] rounded-full bg-[#0b0b16]" />

          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_35px_rgba(34,211,238,0.5)]">
            <Heart className="h-6 w-6 text-white" fill="currentColor" />
          </div>
        </div>

        <p className="text-sm text-slate-300">{label}</p>
        <span className="sr-only">Cargando vista previa</span>
      </div>

      <iframe
        title={title}
        src={src}
        onLoad={() => setLoadedSrc(src)}
        className="h-full w-full border-0"
        sandbox="allow-scripts"
        allow="autoplay"
      />
    </div>
  );
}