"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Copy,
  Share2,
  Plus,
  Check,
  MessageCircle,
} from "lucide-react";

export function ShareBar() {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-slate-950/85 p-1.5 sm:p-2 backdrop-blur-xl shadow-2xl shadow-black/80 max-w-[95vw] sm:max-w-none">
      
      {/* Botón Copiar */}
      <button
        onClick={copyLink}
        className="flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-white/10 active:scale-95"
        title="Copiar enlace"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline sm:inline">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">Copiar</span>
          </>
        )}
      </button>

      {/* Botón WhatsApp */}
      <button
        onClick={openWhatsApp}
        className="flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10 active:scale-95"
        title="Compartir en WhatsApp"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      {/* Botón Compartir NATIVO */}
      <button
        onClick={share}
        className="flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10 active:scale-95"
        title="Compartir"
      >
        <Share2 className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Compartir</span>
      </button>

      {/* Separador vertical sutil */}
      <div className="h-5 w-[1px] bg-white/10 mx-0.5" />

      {/* Botón CTA Crear */}
      <Link
        href="/plantillas"
        className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 active:scale-95 shrink-0"
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span>Crear <span className="hidden xs:inline">otra</span></span>
      </Link>

    </div>
  );
}