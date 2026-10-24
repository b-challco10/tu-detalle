"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  Heart,
  Home,
  Info,
  LayoutTemplate,
  MoreHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Inicio", icon: Home, mobilePrimary: true },
  {
    href: "/plantillas",
    label: "Plantillas",
    icon: LayoutTemplate,
    mobilePrimary: true,
  },
  { href: "/blog", label: "Blog", icon: BookOpen, mobilePrimary: true },
  {
    href: "/#como-funciona",
    label: "Cómo funciona",
    icon: Sparkles,
    mobilePrimary: false,
  },
  { href: "/faq", label: "FAQ", icon: CircleHelp, mobilePrimary: false },
  { href: "/sobre", label: "Sobre", icon: Info, mobilePrimary: false },
];

export function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const primaryLinks = navLinks.filter((l) => l.mobilePrimary);
  const overflowLinks = navLinks.filter((l) => !l.mobilePrimary);
  const overflowActive = overflowLinks.some((l) => isActive(l.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e: MouseEvent | TouchEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  }, [moreOpen]);

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden justify-center px-6 md:flex">
        <nav
          className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 py-2 pl-4 pr-2 backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "bg-[#080810]/70 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
              : "bg-[#080810]/30 shadow-none"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
              <Heart className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-white">
              Tu
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Detalle
              </span>
            </span>
          </Link>

          {/* Links */}
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-300 hover:bg-white/5 hover:text-cyan-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <Link
            href="/plantillas"
            className="btn-gradient-animated group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.03]"
          >
            Crear ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </header>

      {/* ================= MÓVIL ================= */}
      <header className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div
          ref={moreRef}
          className="pointer-events-auto relative w-full max-w-md"
        >
          <nav
            className={`flex items-stretch gap-1 rounded-[28px] border border-white/15 p-2 backdrop-blur-xl transition-all duration-300 ${
              scrolled
                ? "bg-[#080810]/80 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                : "bg-[#080810]/55 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            }`}
          >
            {primaryLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-medium transition-colors ${
                    active
                      ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-slate-300 active:bg-white/10"
                  }`}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                  {link.label}
                </Link>
              );
            })}

            {/* Botón de tres puntos */}
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="Más opciones"
              aria-expanded={moreOpen}
              className={`relative flex min-h-[56px] w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium transition-colors ${
                moreOpen || overflowActive
                  ? "bg-cyan-400/15 text-cyan-300"
                  : "text-slate-300 active:bg-white/10"
              }`}
            >
              {moreOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MoreHorizontal className="h-6 w-6" />
              )}
              Más
              {overflowActive && !moreOpen && (
                <span className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              )}
            </button>
          </nav>

          {/* Menú desplegable */}
          <div
            className={`absolute bottom-full right-0 mb-3 w-72 origin-bottom-right rounded-3xl border border-white/15 bg-[#080810]/95 p-2 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200 ${
              moreOpen
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            {overflowLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-200 active:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5 text-cyan-300" />
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/plantillas"
              onClick={() => setMoreOpen(false)}
              className="btn-gradient-animated mt-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/20"
            >
              Crear ahora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}