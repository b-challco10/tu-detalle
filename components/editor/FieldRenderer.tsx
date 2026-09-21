"use client";

import { useState } from "react";
import type { TemplateField } from "@/lib/templates/types";

interface FieldRendererProps {
  field: TemplateField;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: FieldRendererProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const commonClassName =
    "w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "type",
        field.type === "image" ? "image" : "audio"
      );

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "No se pudo subir el archivo."
        );
      }

      onChange(result.url);
    } catch (error) {
      console.error(error);

      setUploadError(
        error instanceof Error
          ? error.message
          : "No se pudo subir el archivo."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200">
        {field.label}

        {field.required && (
          <span className="ml-1 text-rose-400">*</span>
        )}
      </label>

      {/* TEXT */}
      {field.type === "text" && (
        <input
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={commonClassName}
        />
      )}

      {/* TEXTAREA */}
      {field.type === "textarea" && (
        <textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={5}
          className={`${commonClassName} resize-none`}
        />
      )}

      {/* COLOR */}
      {field.type === "color" && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#22d3ee"}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="h-12 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
          />

          <span className="text-sm text-slate-400">
            {value || "#22d3ee"}
          </span>
        </div>
      )}

      {/* IMAGE */}
      {field.type === "image" && (
        <div className="rounded-xl border border-dashed border-white/15 bg-slate-900/50 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/5">
            <span className="text-3xl">📷</span>

            <span className="text-sm font-medium text-white">
              {uploading
                ? "Subiendo imagen..."
                : "Seleccionar imagen"}
            </span>

            <span className="text-xs text-slate-500">
              JPG, PNG o WEBP
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {value && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <img
                src={value}
                alt="Vista previa"
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          {uploadError && (
            <p className="mt-2 text-xs text-rose-400">
              {uploadError}
            </p>
          )}
        </div>
      )}

      {/* AUDIO */}
      {field.type === "audio" && (
        <div className="rounded-xl border border-dashed border-white/15 bg-slate-900/50 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/5">
            <span className="text-3xl">🎵</span>

            <span className="text-sm font-medium text-white">
              {uploading
                ? "Subiendo canción..."
                : "Seleccionar canción"}
            </span>

            <span className="text-xs text-slate-500">
              MP3, WAV o M4A
            </span>

            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {value && (
            <audio
              controls
              src={value}
              className="mt-4 w-full"
            />
          )}

          {uploadError && (
            <p className="mt-2 text-xs text-rose-400">
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}