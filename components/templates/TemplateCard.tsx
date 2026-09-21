"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Template } from "@/lib/templates/types";

interface Props {
  template: Template;
}

export function TemplateCard({
  template,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="relative aspect-video">
        <Image
          src={template.preview}
          alt={template.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-cyan-300 backdrop-blur">
          {template.category}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="text-xl font-semibold text-white">
          {template.name}
        </h3>

        <p className="text-sm text-slate-400">
          {template.description}
        </p>

        <Link
          href={`/crear/${template.slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <span>Crear detalle</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}