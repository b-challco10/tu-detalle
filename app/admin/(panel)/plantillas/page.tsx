import Link from "next/link";
import { Folder, Pencil, Plus, Eye } from "lucide-react";

import { adminListTemplates } from "@/lib/templates/db";
import { templates as codeTemplates } from "@/lib/templates/registry";
import { TemplateRowActions } from "@/components/admin/TemplateRowActions";

export default async function AdminTemplatesPage() {
  const { rows, error } = await adminListTemplates();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Plantillas</h1>
          <p className="mt-1 text-sm text-slate-300">
            Las creadas aquí se suman a las de la carpeta{" "}
            <code className="text-cyan-300">/templates</code>.
          </p>
        </div>

        <Link
          href="/admin/plantillas/nueva"
          className="btn-gradient-animated inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          Nueva plantilla
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          No se pudieron leer las plantillas: {error}. ¿Ejecutaste el SQL?
        </div>
      )}

      {/* Creadas desde el panel */}
      <h2 className="mt-10 text-lg font-semibold text-white">
        Creadas desde el panel ({rows.length})
      </h2>

      {rows.length === 0 && !error ? (
        <div className="glass-card mt-4 p-8 text-center text-slate-300">
          Todavía no hay plantillas. Crea la primera con el botón de arriba.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="glass-card flex flex-wrap items-center gap-4 p-4"
            >
              {row.preview_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.preview_url}
                  alt=""
                  className="h-14 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-24 items-center justify-center rounded-lg bg-white/5 text-xs text-slate-400">
                  Sin imagen
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{row.name}</p>
                <p className="truncate text-sm text-slate-400">
                  /{row.slug} · {row.category}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  row.active
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                }`}
              >
                {row.active ? "Activa" : "Oculta"}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`/template/${row.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver plantilla"
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-200 transition hover:bg-white/10"
                >
                  <Eye className="h-4 w-4" />
                </a>

                <Link
                  href={`/admin/plantillas/${row.id}`}
                  aria-label="Editar"
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-200 transition hover:bg-white/10"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <TemplateRowActions
                  id={row.id}
                  name={row.name}
                  active={row.active}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* De la carpeta (solo lectura) */}
      <h2 className="mt-12 flex items-center gap-2 text-lg font-semibold text-white">
        <Folder className="h-5 w-5 text-cyan-300" />
        De la carpeta /templates ({codeTemplates.length})
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Solo lectura. Se siguen editando en tu proyecto.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {codeTemplates.map((item) => (
          <li
            key={item.slug}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <p className="truncate font-medium text-slate-100">{item.name}</p>
            <p className="truncate text-xs text-slate-400">
              /{item.slug} · {item.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
