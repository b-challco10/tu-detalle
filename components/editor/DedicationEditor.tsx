"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  DedicationContent,
  Template,
} from "@/lib/templates/types";
import { FieldRenderer } from "./FieldRenderer";
import { TemplateSelector } from "./TemplateSelector";

interface DedicationEditorProps {
  templates: Template[];
}

export function DedicationEditor({ templates }: DedicationEditorProps) {
  const router = useRouter();
  const firstTemplate = templates[0];

  const [selectedSlug, setSelectedSlug] = useState(firstTemplate?.slug ?? "");
  const [content, setContent] = useState<DedicationContent>({});
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.slug === selectedSlug) ?? null,
    [templates, selectedSlug]
  );

  // Progreso de campos obligatorios
  const requiredFields =
    selectedTemplate?.schema.filter((field) => field.required) ?? [];

  const filledCount = requiredFields.filter((field) => {
    const value = content[field.id];
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  const progress = requiredFields.length
    ? Math.round((filledCount / requiredFields.length) * 100)
    : 0;

  // Si solo hay una plantilla no existe el paso 1, así que el editor es el paso 1
  const editorStep = templates.length > 1 ? 2 : 1;

  function updateField(fieldId: string, value: string) {
    setContent((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  async function handleCreate() {
    if (!selectedTemplate) return;

    setError(null);
    setIsCreating(true);

    try {
      // Validar campos obligatorios
      for (const field of selectedTemplate.schema) {
        if (!field.required) continue;

        const value = content[field.id];

        if (typeof value !== "string" || !value.trim()) {
          setError(`Completa el campo "${field.label}".`);
          setIsCreating(false);
          return;
        }
      }

      // Crear dedicatoria
      const response = await fetch("/api/dedicatorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: selectedTemplate.slug,
          content,
        }),
      });

      const text = await response.text();

      let result: {
        url?: string;
        slug?: string;
        error?: string;
      };

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        console.error("Respuesta no válida de /api/dedicatorias:", text);

        throw new Error(
          `El servidor respondió algo que no es JSON (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo crear la dedicatoria.");
      }

      if (!result.url) {
        throw new Error("La API creó la respuesta pero no devolvió la URL.");
      }

      // Ir a la página pública de la dedicatoria
      // (cuando exista la página /creada, cambia esto por:
      // router.push(`/creada?url=${encodeURIComponent(result.url)}`);)
      router.push(result.url);
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Ocurrió un error.");
      setIsCreating(false);
    }
  }

  if (!templates.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-lg font-semibold text-white">
          No hay plantillas disponibles.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Agrega una plantilla dentro de
          <code className="mx-1 text-cyan-300">/templates</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Paso 1: Plantillas */}
      {templates.length > 1 && (
        <section>
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 text-sm font-bold text-white">
              1
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Elige una plantilla
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Selecciona el diseño para tu dedicatoria.
              </p>
            </div>
          </div>

          <TemplateSelector
            templates={templates}
            selectedSlug={selectedSlug}
            onSelect={(slug) => {
              setSelectedSlug(slug);
              setContent({});
              setError(null);
            }}
          />
        </section>
      )}

      {/* Editor */}
      {selectedTemplate && (
        <section className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div>
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 text-sm font-bold text-white">
                {editorStep}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Personaliza tu detalle
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Completa los campos de la plantilla.
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              {/* Barra de progreso */}
              {requiredFields.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Campos obligatorios</span>
                    <span>
                      {filledCount}/{requiredFields.length}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedTemplate.schema.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  value={
                    typeof content[field.id] === "string"
                      ? content[field.id]
                      : undefined
                  }
                  onChange={(value) => updateField(field.id, value)}
                />
              ))}

              {error && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              )}

              <div className="sticky bottom-20 z-10 md:static">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01] hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creando tu detalle..." : "Crear mi detalle ✨"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-5">
              <p className="text-sm font-medium text-cyan-300">PREVIEW</p>
            </div>

            <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl shadow-cyan-500/10">
              <TemplatePreview
                templateSlug={selectedTemplate.slug}
                content={content}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

interface TemplatePreviewProps {
  templateSlug: string;
  content: DedicationContent;
}

function TemplatePreview({ templateSlug, content }: TemplatePreviewProps) {
  const encodedData = encodeContent(content);

  return (
    <iframe
      title="Vista previa"
      src={`/template/${templateSlug}?data=${encodeURIComponent(encodedData)}`}
      className="h-[720px] w-full border-0"
      sandbox="allow-scripts"
      allow="autoplay"
    />
  );
}

function encodeContent(content: DedicationContent) {
  const json = JSON.stringify(content);
  const bytes = new TextEncoder().encode(json);

  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}