"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type { TemplateField } from "@/lib/templates/types";

export type EditableField = TemplateField & { key: string };

const TYPE_LABELS: Record<TemplateField["type"], string> = {
  text: "Texto corto",
  textarea: "Texto largo",
  color: "Color",
  image: "Imagen",
  audio: "Audio / música",
};

const smallInput =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70";

export function newKey() {
  return Math.random().toString(36).slice(2, 10);
}

function uniqueId(base: string, fields: EditableField[]) {
  const used = new Set(fields.map((f) => f.id));
  if (!used.has(base)) return base;

  let n = 2;
  while (used.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

interface Props {
  fields: EditableField[];
  onChange: (fields: EditableField[]) => void;
}

export function SchemaEditor({ fields, onChange }: Props) {
  function add(partial: Omit<TemplateField, "id"> & { idBase: string }) {
    const { idBase, ...rest } = partial;

    onChange([
      ...fields,
      { ...rest, id: uniqueId(idBase, fields), key: newKey() },
    ]);
  }

  function update(key: string, patch: Partial<TemplateField>) {
    onChange(fields.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  }

  function remove(key: string) {
    onChange(fields.filter((f) => f.key !== key));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;

    const copy = [...fields];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  const quickAdds: { label: string; run: () => void }[] = [
    {
      label: "Título",
      run: () => add({ idBase: "titulo", type: "text", label: "Título principal" }),
    },
    {
      label: "Mensaje",
      run: () =>
        add({ idBase: "mensaje", type: "textarea", label: "Mensaje o dedicatoria" }),
    },
    {
      label: "Foto",
      run: () => {
        const photos = fields.filter((f) => f.type === "image").length + 1;
        add({ idBase: `photo${photos}`, type: "image", label: `Foto ${photos}` });
      },
    },
    {
      label: "Música",
      run: () =>
        add({ idBase: "bgMusic", type: "audio", label: "Música de fondo (opcional)" }),
    },
    {
      label: "Color",
      run: () =>
        add({ idBase: "primaryColor", type: "color", label: "Color principal" }),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {quickAdds.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.run}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <Plus className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {fields.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">
          Aún no hay campos. Agrega los que el usuario podrá personalizar.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {fields.map((field, index) => (
          <li
            key={field.key}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-400">
                  Etiqueta (lo que ve el usuario)
                </label>
                <input
                  value={field.label}
                  onChange={(e) => update(field.key, { label: e.target.value })}
                  className={smallInput}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">
                  Id (tu JS lo lee como data.
                  <span className="text-cyan-300">{field.id || "id"}</span>)
                </label>
                <input
                  value={field.id}
                  onChange={(e) =>
                    update(field.key, {
                      id: e.target.value.replace(/[^A-Za-z0-9_]/g, ""),
                    })
                  }
                  className={`${smallInput} font-mono`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">Tipo</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    update(field.key, {
                      type: e.target.value as TemplateField["type"],
                    })
                  }
                  className={`${smallInput} [&>option]:bg-[#0b0b16]`}
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-400">
                  Texto de ejemplo (placeholder)
                </label>
                <input
                  value={field.placeholder ?? ""}
                  onChange={(e) =>
                    update(field.key, { placeholder: e.target.value })
                  }
                  disabled={field.type === "image" || field.type === "audio" || field.type === "color"}
                  className={`${smallInput} disabled:opacity-40`}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={field.required === true}
                  onChange={(e) =>
                    update(field.key, { required: e.target.checked })
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
                Obligatorio
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Subir"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === fields.length - 1}
                  aria-label="Bajar"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(field.key)}
                  aria-label="Quitar campo"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
