"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Save, Upload } from "lucide-react";

import type { TemplateField } from "@/lib/templates/types";
import { CATEGORIES } from "@/lib/templates/categories";
import { buildTemplateHtml } from "@/lib/templates/build-html";
import { SchemaEditor, newKey, type EditableField } from "./SchemaEditor";

export interface TemplateFormInitial {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  preview_url: string;
  schema: TemplateField[];
  html: string;
  css: string;
  js: string;
  active: boolean;
}

type Tab = "html" | "css" | "js";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 hover:border-white/20 focus:border-cyan-400/70 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]";

const labelClass = "mb-2 block text-sm font-medium text-slate-200";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function TemplateForm({ initial }: { initial?: TemplateFormInitial }) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [previewUrl, setPreviewUrl] = useState(initial?.preview_url ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const [html, setHtml] = useState(initial?.html ?? "");
  const [css, setCss] = useState(initial?.css ?? "");
  const [js, setJs] = useState(initial?.js ?? "");
  const [tab, setTab] = useState<Tab>("html");

  const [fields, setFields] = useState<EditableField[]>(() =>
    (initial?.schema ?? []).map((f) => ({ ...f, key: newKey() }))
  );

  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = CATEGORIES.includes(category as (typeof CATEGORIES)[number])
    ? [...CATEGORIES]
    : [category, ...CATEGORIES];

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleUploadPreview(file: File) {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "No se pudo subir la imagen.");

      setPreviewUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function openPreview() {
    // Datos de ejemplo tomados de los campos para ver la plantilla "llena"
    const data: Record<string, string> = {};

    for (const field of fields) {
      if (field.type === "text" || field.type === "textarea") {
        data[field.id] = field.placeholder || field.label;
      } else if (field.type === "color") {
        data[field.id] = "#ff4d6d";
      }
    }

    setPreviewDoc(buildTemplateHtml(html, css, js, data));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);

    const payload = {
      slug,
      name,
      description,
      category,
      preview_url: previewUrl || null,
      schema: fields.map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder,
        required: f.required,
      })),
      html,
      css,
      js,
      active,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/admin/templates/${initial!.id}` : "/api/admin/templates",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar.");

      router.push("/admin/plantillas");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  const code = { html, css, js }[tab];
  const setCode = { html: setHtml, css: setCss, js: setJs }[tab];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
      {/* ============ COLUMNA IZQUIERDA ============ */}
      <div className="space-y-8">
        {/* Datos básicos */}
        <section className="glass-card space-y-5 p-6">
          <h2 className="text-lg font-semibold text-white">1. Datos básicos</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Pino Navideño 3D"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Slug (la dirección)</label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="pino-navideno"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} [&>option]:bg-[#0b0b16]`}
            >
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Qué incluye la plantilla..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Imagen de la tarjeta</label>

            <div className="flex flex-wrap items-center gap-3">
              <input
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://... o /templates/mi-imagen.png"
                className={`${inputClass} min-w-0 flex-1`}
              />

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Subir
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPreview(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Vista previa de la tarjeta"
                className="mt-3 h-36 w-64 rounded-xl border border-white/10 object-cover"
              />
            )}
          </div>
        </section>

        {/* Código */}
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">2. Código</h2>
          <p className="mt-1 text-sm text-slate-300">
            Pega cada archivo por separado. El CSS y el JS se unen al HTML
            automáticamente, así que no hace falta el{" "}
            <code className="text-cyan-300">&lt;link href=&quot;style.css&quot;&gt;</code> ni el{" "}
            <code className="text-cyan-300">&lt;script src=&quot;script.js&quot;&gt;</code> (se
            ignoran).
          </p>

          <div className="mt-4 flex gap-2">
            {(["html", "css", "js"] as Tab[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium uppercase transition ${
                  tab === item
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item}
                {{ html, css, js }[item].trim() ? " ●" : ""}
              </button>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            wrap="off"
            placeholder={`Pega aquí el ${tab.toUpperCase()}...`}
            className="mt-3 h-[420px] w-full resize-y overflow-auto rounded-xl border border-white/10 bg-[#05050d] p-4 font-mono text-[13px] leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70"
          />
        </section>

        {/* Campos */}
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white">
            3. Campos del formulario
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-300">
            Es lo que el usuario rellena. En tu JS los datos llegan en{" "}
            <code className="text-cyan-300">window.__TUDETALLE_DATA__</code>.
          </p>

          <SchemaEditor fields={fields} onChange={setFields} />
        </section>

        {/* Publicación */}
        <section className="glass-card space-y-5 p-6">
          <h2 className="text-lg font-semibold text-white">4. Publicación</h2>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-100">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-cyan-400"
            />
            Activa (visible para todos). Desmárcala para dejarla oculta.
          </label>

          {error && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-gradient-animated inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "Guardar cambios" : "Crear plantilla"}
          </button>
        </section>
      </div>

      {/* ============ COLUMNA DERECHA: VISTA PREVIA ============ */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-cyan-300">VISTA PREVIA</p>

          <button
            type="button"
            onClick={openPreview}
            disabled={!html.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10 disabled:opacity-40"
          >
            <Eye className="h-4 w-4" />
            {previewDoc ? "Actualizar" : "Ver"}
          </button>
        </div>

        <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl shadow-cyan-500/10">
          {previewDoc ? (
            <iframe
              title="Vista previa de la plantilla"
              srcDoc={previewDoc}
              sandbox="allow-scripts"
              allow="autoplay"
              className="h-[720px] w-full border-0"
            />
          ) : (
            <div className="flex h-[720px] items-center justify-center px-8 text-center text-sm text-slate-400">
              Pega tu HTML y pulsa “Ver” para probar la plantilla antes de
              guardarla.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
