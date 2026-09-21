"use client";

import Image from "next/image";

import type { Template } from "@/lib/templates/types";

interface TemplateSelectorProps {
  templates: Template[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export function TemplateSelector({
  templates,
  selectedSlug,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => {
        const selected =
          template.slug === selectedSlug;

        return (
          <button
            key={template.slug}
            type="button"
            onClick={() =>
              onSelect(template.slug)
            }
            className={[
              "group overflow-hidden rounded-3xl border text-left transition-all duration-300",
              selected
                ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,.18)]"
                : "border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:-translate-y-1",
            ].join(" ")}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={
                  template.preview ??
                  "/placeholder.jpg"
                }
                alt={template.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-cyan-300 backdrop-blur">
                {template.category}
              </span>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {template.name}
                </h3>

                {selected && (
                  <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-xs text-cyan-300">
                    Seleccionada
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-400">
                {template.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}