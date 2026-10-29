"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, LayoutTemplate, Tags } from "lucide-react";

type IconKey = "created" | "templates" | "categories";

export interface StatItem {
  icon: IconKey;
  value: number;
  label: string;
  /** Ej: "+" para mostrar "+1.200" */
  prefix?: string;
}

// Los iconos se eligen aquí porque un componente de servidor
// no puede pasarle funciones a uno de cliente.
const ICONS = {
  created: Heart,
  templates: LayoutTemplate,
  categories: Tags,
} as const;

// 1234 -> "1.234"
const withDots = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Sube de 0 al número final con una animación suave. */
function useCountUp(target: number, start: boolean, duration = 1700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    // Con "reducir movimiento" se muestra el número final sin animar
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // rápido al inicio, suave al final

      setValue(Math.round(target * eased));

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

function StatCard({ item, start }: { item: StatItem; start: boolean }) {
  const Icon = ICONS[item.icon];
  const value = useCountUp(item.value, start);
  const prefix = item.prefix ?? "";

  return (
    <div className="glass-card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 md:p-8">
      {/* Resplandor detrás del número */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/15 blur-[60px] transition group-hover:bg-cyan-400/25" />

      <div className="relative flex items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
          <Icon
            className="h-7 w-7"
            fill={item.icon === "created" ? "currentColor" : "none"}
          />
        </div>

        <div className="min-w-0">
          {/* Número animado (los lectores de pantalla leen el valor final) */}
          <p
            aria-hidden="true"
            className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-5xl font-bold leading-none tabular-nums text-transparent md:text-6xl"
          >
            {prefix}
            {withDots(value)}
          </p>

          <span className="sr-only">
            {prefix}
            {withDots(item.value)} {item.label}
          </span>

          <p aria-hidden="true" className="mt-2 text-sm text-slate-300 md:text-base">
            {item.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatsShowcase({ items }: { items: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // La cuenta empieza cuando la sección aparece en pantalla
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  const columns =
    items.length >= 3
      ? "md:grid-cols-3"
      : items.length === 2
        ? "sm:grid-cols-2"
        : "";

  return (
    <div ref={ref} className={`grid gap-4 ${columns}`}>
      {items.map((item) => (
        <StatCard key={item.label} item={item} start={visible} />
      ))}
    </div>
  );
}