"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Copy,
  Share2,
  Plus,
  Check,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function ShareBar() {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  function openWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      window.location.href
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi detalle ❤️",
          url: window.location.href,
        });
      } catch {}
    } else {
      copyLink();
    }
  }

  // ShareBar oculta
  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        className="
          fixed bottom-4 left-1/2 z-50
          flex -translate-x-1/2
          items-center justify-center
          rounded-full
          border border-white/10
          bg-slate-950/95
          p-3
          text-white
          shadow-2xl shadow-black/80
          backdrop-blur-xl
          transition
          hover:scale-105
          hover:bg-slate-900
          active:scale-95
        "
        title="Mostrar barra"
        aria-label="Mostrar barra de compartir"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      className="
        fixed bottom-4 left-1/2 z-50
        flex -translate-x-1/2
        items-center
        justify-center

        /* Nunca ocupar más que la pantalla */
        w-max
        max-w-[calc(100vw-16px)]

        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-slate-950/90
        p-1
        shadow-2xl shadow-black/80
        backdrop-blur-xl

        sm:p-1.5
        lg:gap-1.5
        lg:p-2
      "
    >
      {/* ==================== COPIAR ==================== */}
      <button
        onClick={copyLink}
        className="
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          p-2
          text-white
          transition
          hover:bg-white/10
          active:scale-95

          lg:gap-2
          lg:px-4
          lg:py-2
        "
        title="Copiar enlace"
        aria-label="Copiar enlace"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}

        {/* Texto solamente desde 1024px */}
        <span className="hidden text-sm font-medium lg:inline">
          {copied ? "Copiado" : "Copiar"}
        </span>
      </button>

      {/* ==================== WHATSAPP ==================== */}
      <button
        onClick={openWhatsApp}
        className="
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          p-2
          text-emerald-400
          transition
          hover:bg-emerald-500/10
          active:scale-95

          lg:gap-2
          lg:px-4
          lg:py-2
        "
        title="Compartir en WhatsApp"
        aria-label="Compartir en WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />

        <span className="hidden text-sm font-medium lg:inline">
          WhatsApp
        </span>
      </button>

      {/* ==================== COMPARTIR ==================== */}
      <button
        onClick={share}
        className="
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          p-2
          text-cyan-300
          transition
          hover:bg-cyan-500/10
          active:scale-95

          lg:gap-2
          lg:px-4
          lg:py-2
        "
        title="Compartir"
        aria-label="Compartir"
      >
        <Share2 className="h-4 w-4" />

        <span className="hidden text-sm font-medium lg:inline">
          Compartir
        </span>
      </button>

      {/* ==================== SEPARADOR ==================== */}
      <div className="mx-0.5 h-5 w-px shrink-0 bg-white/10" />

      {/* ==================== CREAR ==================== */}
      <Link
        href="/plantillas"
        className="
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-emerald-400
          p-2
          text-white
          shadow-lg
          shadow-cyan-500/20
          transition
          hover:scale-105
          active:scale-95

          lg:gap-2
          lg:px-4
          lg:py-2
        "
        title="Crear otra"
        aria-label="Crear otra"
      >
        <Plus className="h-4 w-4" />

        <span className="hidden text-sm font-semibold lg:inline">
          Crear otra
        </span>
      </Link>

      {/* ==================== SEPARADOR ==================== */}
      <div className="mx-0.5 h-5 w-px shrink-0 bg-white/10" />

      {/* ==================== OCULTAR ==================== */}
      <button
        onClick={() => setHidden(true)}
        className="
          flex
          shrink-0
          items-center
          justify-center
          rounded-xl
          p-2
          text-slate-400
          transition
          hover:bg-white/10
          hover:text-white
          active:scale-95
        "
        title="Ocultar barra"
        aria-label="Ocultar barra de compartir"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}