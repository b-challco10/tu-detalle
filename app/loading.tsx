import { Heart } from "lucide-react";

// app/loading.tsx
// Next.js lo muestra automáticamente mientras carga una página.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="td-fade fixed inset-0 z-[60] flex items-center justify-center bg-[#080810] px-4"
    >
      {/* Animaciones propias de este componente */}
      <style>{`
        @keyframes tdFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tdSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes tdFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        /* Aparece solo si la carga tarda más de 150 ms (evita parpadeos) */
        .td-fade { animation: tdFade .4s ease .15s both; }
        .td-slide { animation: tdSlide 1.4s ease-in-out infinite; }
        .td-float { animation: tdFloat 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .td-slide, .td-float { animation: none; }
        }
      `}</style>

      {/* Resplandores */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[140px]" />
        <div className="absolute -left-40 top-1/2 h-[340px] w-[340px] rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full bg-emerald-400/15 blur-[120px]" />
      </div>

      {/* Estrellas */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:45px_45px]" />

      {/* Tarjeta de vidrio */}
      <div className="glass-card td-float relative flex w-full max-w-xs flex-col items-center px-8 py-10 text-center">
        {/* Anillo de degradado girando + logo */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0%,#2563eb_30%,#22d3ee_65%,#34d399_100%)] motion-reduce:animate-none" />
          <div className="absolute inset-[3px] rounded-full bg-[#0b0b16]" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]">
            <Heart className="h-7 w-7 text-white" fill="currentColor" />
          </div>
        </div>

        <p className="mt-6 text-2xl font-bold text-white">
          Tu
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Detalle
          </span>
        </p>

        <p className="mt-2 text-sm text-slate-300">Preparando tu experiencia…</p>

        {/* Barra indeterminada */}
        <div className="relative mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="td-slide btn-gradient-animated absolute inset-y-0 left-0 w-2/5 rounded-full" />
        </div>
      </div>

      <span className="sr-only">Cargando contenido</span>
    </div>
  );
}