"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SearchX, X } from "lucide-react";

import type { Template } from "@/lib/templates/types";
import { TemplateGrid } from "./TemplateGrid";

// "Romántica" y "romantica" son lo mismo para la búsqueda
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Para la dirección: "Día de la Madre" -> "dia-de-la-madre"
const slugify = (value: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const MAX_QUERY = 80;

interface Props {
  templates: Template[];
}

export function TemplateBrowser({ templates }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(""); // "" = todas
  const inputRef = useRef<HTMLInputElement>(null);
  const urlReady = useRef(false);

  /* ---------- categorías que existen, de la más usada a la menos ---------- */
  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    for (const t of templates) {
      counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
      .map(([name]) => name);
  }, [templates]);

  /* ---------- leer ?q= y ?categoria= al abrir la página ---------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const q = (params.get("q") ?? "").slice(0, MAX_QUERY);
    const c = params.get("categoria") ?? "";

    if (q) setQuery(q);

    if (c) {
      const match = categories.find((name) => slugify(name) === slugify(c));
      if (match) setCategory(match);
    }
  }, [categories]);

  /* ---------- guardar los filtros en la dirección (se puede compartir) ---------- */
  useEffect(() => {
    // La primera vez solo se marca como lista, para no borrar lo que trae la URL
    if (!urlReady.current) {
      urlReady.current = true;
      return;
    }

    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("categoria", slugify(category));

    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;

    window.history.replaceState(null, "", url);
  }, [query, category]);

  /* ---------- atajo: "/" enfoca el buscador ---------- */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- filtrado ---------- */
  const terms = useMemo(
    () => normalize(query).split(/\s+/).filter(Boolean),
    [query]
  );

  // Busca en nombre, descripción y categoría. Todas las palabras deben aparecer.
  const matchesSearch = useMemo(
    () =>
      templates.map((t) => {
        const haystack = normalize(`${t.name} ${t.description} ${t.category}`);
        return terms.every((term) => haystack.includes(term));
      }),
    [templates, terms]
  );

  // Cuántas plantillas hay por categoría con la búsqueda actual
  const facetCounts = useMemo(() => {
    const counts = new Map<string, number>();

    templates.forEach((t, i) => {
      if (matchesSearch[i]) {
        counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
      }
    });

    return counts;
  }, [templates, matchesSearch]);

  const totalMatching = matchesSearch.filter(Boolean).length;

  const filtered = useMemo(
    () =>
      templates.filter(
        (t, i) => matchesSearch[i] && (!category || t.category === category)
      ),
    [templates, matchesSearch, category]
  );

  const hasFilters = Boolean(query.trim() || category);

  function clearAll() {
    setQuery("");
    setCategory("");
    inputRef.current?.focus();
  }

  return (
    <div>
      {/* ================= Buscador y filtros ================= */}
      <div className="sticky top-2 z-30 rounded-3xl border border-white/10 bg-[#080810]/75 p-3 backdrop-blur-xl md:top-[5.25rem]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            ref={inputRef}
            type="search"
            value={query}
            maxLength={MAX_QUERY}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, ocasión o estilo…"
            aria-label="Buscar plantillas"
            autoComplete="off"
            enterKeyHint="search"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-12 text-base text-white outline-none transition placeholder:text-slate-400 hover:border-white/20 focus:border-cyan-400/70 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] [&::-webkit-search-cancel-button]:hidden"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Borrar búsqueda"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Chip
              label="Todas"
              count={totalMatching}
              active={!category}
              onClick={() => setCategory("")}
            />

            {categories.map((name) => {
              const count = facetCounts.get(name) ?? 0;

              return (
                <Chip
                  key={name}
                  label={name}
                  count={count}
                  active={category === name}
                  disabled={count === 0 && category !== name}
                  onClick={() => setCategory(category === name ? "" : name)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ================= Contador de resultados ================= */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-300">
          Mostrando{" "}
          <strong className="font-semibold text-white">{filtered.length}</strong>{" "}
          de{" "}
          <strong className="font-semibold text-white">{templates.length}</strong>{" "}
          {templates.length === 1 ? "plantilla" : "plantillas"}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* ================= Resultados ================= */}
      <div className="mt-6">
        {filtered.length > 0 ? (
          <TemplateGrid templates={filtered} />
        ) : (
          <div className="glass-card mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/30 via-cyan-400/25 to-emerald-400/25 text-cyan-200">
              <SearchX className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No encontramos plantillas
              {query.trim() ? ` para “${query.trim()}”` : ""}
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Prueba con otra palabra (por ejemplo “rosas”, “navidad” o
              “fotos”) o quita los filtros.
            </p>

            <button
              type="button"
              onClick={clearAll}
              className="btn-gradient-animated mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25"
            >
              Ver todas las plantillas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Chip({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
          : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/25 hover:bg-white/[0.08]"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-xs ${
          active ? "bg-cyan-400/25 text-cyan-100" : "bg-white/10 text-slate-300"
        }`}
      >
        {count}
      </span>
    </button>
  );
}