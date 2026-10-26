"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";

const itemBase =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition active:scale-95 md:flex-none md:flex-row md:gap-2 md:px-4 md:text-sm";

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

  /* ---------------- Barra contraída: franja mínima ---------------- */
  if (hidden) {
    return (
      <div className="shrink-0 border-t border-white/10 bg-[#080810] pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={() => setHidden(false)}
          className="flex h-9 w-full items-center justify-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
          aria-label="Mostrar opciones de compartir"
        >
          <ChevronUp className="h-4 w-4" />
          Opciones
        </button>
      </div>
    );
  }

  /* ---------------- Barra completa ---------------- */
  return (
    <div className="shrink-0 border-t border-white/10 bg-[#080810] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
      <div className="mx-auto flex max-w-xl items-stretch gap-1 md:max-w-none md:items-center md:justify-center">
        {/* Copiar */}
        <button
          type="button"
          onClick={copyLink}
          className={`${itemBase} text-white hover:bg-white/10`}
          aria-label="Copiar enlace"
        >
          {copied ? (
            <Check className="h-5 w-5 text-emerald-400" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={openWhatsApp}
          className={`${itemBase} text-emerald-400 hover:bg-emerald-500/10`}
          aria-label="Compartir en WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span>WhatsApp</span>
        </button>

        {/* Compartir */}
        <button
          type="button"
          onClick={share}
          className={`${itemBase} text-cyan-300 hover:bg-cyan-500/10`}
          aria-label="Compartir"
        >
          <Share2 className="h-5 w-5" />
          <span>Compartir</span>
        </button>

        <div className="my-2 w-px shrink-0 bg-white/10" />

        {/* Crear otra */}
        <Link
          href="/plantillas"
          className={`${itemBase} bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 md:font-semibold`}
          aria-label="Crear otra"
        >
          <Plus className="h-5 w-5" />
          <span>Crear otra</span>
        </Link>

        {/* Ocultar */}
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="flex w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white active:scale-95"
          aria-label="Ocultar opciones de compartir"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}