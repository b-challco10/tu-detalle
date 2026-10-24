"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

import type {
  DedicationContent,
  Template,
} from "@/lib/templates/types";
import { TemplateFrame } from "@/components/templates/TemplateFrame";
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
      {isCreating && <CreatingOverlay />}

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

            <div className="glass-card space-y-6 p-6">
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

              <div className="sticky bottom-28 z-10 md:static">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  aria-busy={isCreating}
                  className="btn-gradient-animated flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01] hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creando tu detalle...
                    </>
                  ) : (
                    "Crear mi detalle ✨"
                  )}
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
  // Esperamos 600 ms sin escribir antes de recargar el preview,
  // así el iframe no se recarga con cada tecla.
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedContent(content), 600);
    return () => clearTimeout(id);
  }, [content]);

  const encodedData = encodeContent(debouncedContent);

  return (
    <TemplateFrame
      src={`/template/${templateSlug}?data=${encodeURIComponent(encodedData)}`}
      title="Vista previa"
      heightClassName="h-[720px]"
      label="Cargando vista previa..."
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

const CREATING_MESSAGES = [
  "Guardando tu mensaje...",
  "Preparando tus fotos y tu música...",
  "Generando tu enlace único...",
  "Ya casi está listo ✨",
];

function CreatingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, CREATING_MESSAGES.length - 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#080810]/80 px-4 backdrop-blur-md"
    >
      <div className="glass-card flex w-full max-w-xs flex-col items-center px-8 py-10 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0%,#2563eb_30%,#22d3ee_65%,#34d399_100%)] motion-reduce:animate-none" />
          <div className="absolute inset-[3px] rounded-full bg-[#0b0b16]" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]">
            <Heart className="h-7 w-7 text-white" fill="currentColor" />
          </div>
        </div>

        <h3 className="mt-6 text-xl font-bold text-white">
          Creando tu detalle
        </h3>

        <p className="mt-2 min-h-[20px] text-sm text-slate-300">
          {CREATING_MESSAGES[index]}
        </p>

        <p className="mt-5 text-xs text-slate-400">
          No cierres esta página
        </p>
      </div>
    </div>
  );
}