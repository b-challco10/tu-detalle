import { Heart, LayoutTemplate } from "lucide-react";

interface Props {
  templateCount: number;
  /** Ej: "+1.200". Si es null, no se muestra. */
  createdLabel: string | null;
}

const pill =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md";

export function StatsPills({ templateCount, createdLabel }: Props) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <span className={pill}>
        <LayoutTemplate className="h-4 w-4 text-cyan-300" />
        <strong className="font-semibold text-white">{templateCount}</strong>
        {templateCount === 1 ? "plantilla" : "plantillas"}
      </span>

      {createdLabel && (
        <span className={pill}>
          <Heart className="h-4 w-4 text-rose-300" fill="currentColor" />
          <strong className="font-semibold text-white">{createdLabel}</strong>
          detalles creados
        </span>
      )}
    </div>
  );
}