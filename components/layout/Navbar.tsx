"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para determinar si el link está activo
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/plantillas", label: "Plantillas" },
    { href: "/#como-funciona", label: "Cómo funciona" },
    { href: "/faq", label: "FAQ" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-slate-950/70 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            <Heart className="h-5 w-5 text-white" fill="currentColor" />
          </div>

          <span className="text-xl font-bold text-white">
            Tu
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Detalle
            </span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-300 hover:text-cyan-300"
                }`}
              >
                {link.label}
                {/* Línea animada con degradado para la ruta activa */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 transition-all duration-300 ${
                    active
                      ? "opacity-100 scale-x-100 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                      : "opacity-0 scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/plantillas"
            className="rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-105"
          >
            Crear ahora ✨
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 text-white transition-opacity hover:opacity-70 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-white/5 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2 px-4 py-5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`relative overflow-hidden rounded-xl px-4 py-3 text-slate-300 transition-all ${
                    active
                      ? "bg-white/5 text-white font-semibold"
                      : "hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {/* Borde lateral izquierdo con degradado para mobile */}
                  {active && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-cyan-400 to-emerald-400" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/plantillas"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-4 py-3 text-center font-semibold text-white shadow-lg shadow-cyan-500/20"
            >
              Crear detalle ✨
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}