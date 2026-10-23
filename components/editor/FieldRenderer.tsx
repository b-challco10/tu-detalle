"use client";

import { useState } from "react";
import { Camera, Loader2, Music, Palette, Type, X } from "lucide-react";
import type { TemplateField } from "@/lib/templates/types";

interface FieldRendererProps {
  field: TemplateField;
  value: string | undefined;
  onChange: (value: string) => void;
}

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] text-sm text-white outline-none transition placeholder:text-slate-400 hover:border-white/20 focus:border-cyan-400/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]";

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", field.type === "image" ? "image" : "audio");

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo subir el archivo.");
      }
      onChange(result.url);
    } catch (error) {
      console.error(error);
      setUploadError(
        error instanceof Error ? error.message : "No se pudo subir el archivo."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = ""; // permite volver a elegir el mismo archivo
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading) uploadFile(file);
  }

  const isMedia = field.type === "image" || field.type === "audio";
  const isImage = field.type === "image";
  const MediaIcon = isImage ? Camera : Music;

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-slate-200">
        <span>
          {field.label}
          {field.required && <span className="ml-1 text-rose-400">*</span>}
        </span>
        {!field.required && (
          <span className="text-xs font-normal text-slate-400">Opcional</span>
        )}
      </label>

      {/* TEXT */}
      {field.type === "text" && (
        <div className="relative">
          <Type className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={`${inputBase} py-3.5 pl-11 pr-4`}
          />
        </div>
      )}

      {/* TEXTAREA */}
      {field.type === "textarea" && (
        <div className="relative">
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={5}
            className={`${inputBase} resize-none px-4 py-3.5 pb-8`}
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-slate-400">
            {(value ?? "").length} caracteres
          </span>
        </div>
      )}

      {/* COLOR */}
      {field.type === "color" && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition hover:border-white/20">
          <span
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg ring-2 ring-white/20"
            style={{ backgroundColor: value || "#22d3ee" }}
          >
            <Palette className="h-4 w-4 text-white/80 mix-blend-difference" />
            <input
              type="color"
              value={value || "#22d3ee"}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </span>
          <span className="font-mono text-sm uppercase text-slate-300">
            {value || "#22d3ee"}
          </span>
        </label>
      )}

      {/* IMAGE / AUDIO */}
      {isMedia && (
        <div>
          {!value ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                dragging
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-white/15 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-cyan-400/5"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/30 via-cyan-400/20 to-emerald-400/20 text-cyan-300">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MediaIcon className="h-5 w-5" />
                )}
              </span>

              <span className="text-sm font-medium text-white">
                {uploading
                  ? "Subiendo..."
                  : isImage
                  ? "Toca o arrastra tu imagen"
                  : "Toca o arrastra tu canción"}
              </span>

              <span className="text-xs text-slate-400">
                {isImage ? "JPG, PNG o WEBP" : "MP3, WAV o M4A"}
              </span>

              <input
                type="file"
                accept={
                  isImage
                    ? "image/jpeg,image/png,image/webp"
                    : "audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
                }
                onChange={handleInput}
                disabled={uploading}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              {isImage ? (
                <img
                  src={value}
                  alt="Vista previa"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="p-3">
                  <audio controls src={value} className="w-full" />
                </div>
              )}

              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Quitar archivo"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {uploadError && (
            <p className="mt-2 text-xs text-rose-400">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}