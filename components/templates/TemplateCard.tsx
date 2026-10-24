import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Template } from "@/lib/templates/types";

interface Props {
  template: Template;
}

export function TemplateCard({ template }: Props) {
  const preview = template.preview || "/placeholder.svg";

  return (
    <div className="group card-3d relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#080810] hover:border-cyan-400/40">
      {/* Fondo: la misma imagen, ampliada y desenfocada.
          Es lo que se "ve a través" del vidrio y le da el color de cada plantilla */}
      <Image
        src={preview}
        alt=""
        fill
        aria-hidden
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="pointer-events-none scale-150 object-cover opacity-60 blur-2xl"
      />

      {/* Imagen principal */}
      <div className="relative z-10 aspect-video shrink-0">
        <Image
          src={preview}
          alt={template.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur-md">
          {template.category}
        </span>
      </div>

      {/* Panel de vidrio */}
      <div className="relative z-10 flex flex-1 flex-col border-t border-white/20 bg-gradient-to-b from-white/[0.14] to-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white">{template.name}</h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-200">
          {template.description}
        </p>

        <div className="mt-auto pt-5">
          <span className="btn-gradient-animated inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25">
            Crear detalle
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {/* Toda la tarjeta es un enlace */}
      <Link
        href={`/crear/${template.slug}`}
        aria-label={`Crear detalle con la plantilla ${template.name}`}
        className="absolute inset-0 z-20"
      />
    </div>
  );
}