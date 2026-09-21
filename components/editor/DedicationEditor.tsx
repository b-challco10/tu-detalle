"use client";

import { useMemo, useState } from "react";

import type {
  DedicationContent,
  Template,
} from "@/lib/templates/types";
import { useRouter } from "next/navigation";
import { FieldRenderer } from "./FieldRenderer";
import { TemplateSelector } from "./TemplateSelector";

interface DedicationEditorProps {
  templates: Template[];
}

export function DedicationEditor({
  templates,
}: DedicationEditorProps) {
  const firstTemplate = templates[0];

  const [selectedSlug, setSelectedSlug] =
    useState(firstTemplate?.slug ?? "");

  const [content, setContent] =
    useState<DedicationContent>({});

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (template) =>
          template.slug === selectedSlug
      ) ?? null,
    [templates, selectedSlug]
  );
  const router = useRouter();

const [isCreating, setIsCreating] =
  useState(false);

const [error, setError] =
  useState<string | null>(null);

  function updateField(
    fieldId: string,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }
async function handleCreate() {
  if (!selectedTemplate) {
    return;
  }

  setError(null);
  setIsCreating(true);

  try {
    /*
     * Validar campos obligatorios
     */

    for (const field of selectedTemplate.schema) {
      if (!field.required) {
        continue;
      }

      const value = content[field.id];

      if (
        typeof value !== "string" ||
        !value.trim()
      ) {
        setError(
          `Completa el campo "${field.label}".`
        );

        setIsCreating(false);
        return;
      }
    }

    /*
     * Crear dedicatoria
     */

    const response = await fetch(
      "/api/dedicatorias",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id:
            selectedTemplate.slug,
          content,
        }),
      }
    );

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
  throw new Error(
    result.error ?? "No se pudo crear la dedicatoria."
  );
}

if (!result.url) {
  throw new Error(
    "La API creó la respuesta pero no devolvió la URL."
  );
}

router.push(`/creada?url=${encodeURIComponent(result.url)}`);
    /*
     * Ir a la página pública
     */

    router.push(result.url);
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Ocurrió un error."
    );

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
          <code className="mx-1 text-cyan-300">
            /templates
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Plantillas */}

      {/* Plantillas */}

{templates.length > 1 && (
  <section>
    <div className="mb-5">
      <p className="text-sm font-medium text-cyan-300">
        PASO 1
      </p>

      <h2 className="mt-1 text-2xl font-bold text-white">
        Elige una plantilla
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Selecciona el diseño para tu
        dedicatoria.
      </p>
    </div>

    <TemplateSelector
      templates={templates}
      selectedSlug={selectedSlug}
      onSelect={(slug) => {
        setSelectedSlug(slug);
        setContent({});
      }}
    />
  </section>
)}

{/* Editor */}

      {selectedTemplate && (
        <section className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div>
            <div className="mb-5">
              <p className="text-sm font-medium text-cyan-300">
                PASO 2
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Personaliza tu detalle
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Completa los campos de la plantilla.
              </p>
            </div>

            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              {selectedTemplate.schema.map(
                (field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={
                      typeof content[field.id] ===
                      "string"
                        ? content[field.id]
                        : undefined
                    }
                    onChange={(value) =>
                      updateField(
                        field.id,
                        value
                      )
                    }
                  />
                )
              )}

<button
  type="button"
  onClick={handleCreate}
  disabled={isCreating}
  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
>
  {isCreating
    ? "Creando tu detalle..."
    : "Crear mi detalle ✨"}
</button>
{error && (
  <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
    {error}
  </div>
)}
            </div>
          </div>

          {/* Preview */}

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-5">
              <p className="text-sm font-medium text-cyan-300">
                PREVIEW
              </p>
            </div>

            <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl shadow-cyan-500/10">
              <TemplatePreview
                templateSlug={
                  selectedTemplate.slug
                }
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

function TemplatePreview({
  templateSlug,
  content,
}: TemplatePreviewProps) {
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

function encodeContent(
  content: DedicationContent
) {
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