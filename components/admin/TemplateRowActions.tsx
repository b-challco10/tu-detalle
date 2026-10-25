"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye, Loader2, Trash2 } from "lucide-react";

interface Props {
  id: string;
  name: string;
  active: boolean;
}

const btn =
  "rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-200 transition hover:bg-white/10 disabled:opacity-50";

export function TemplateRowActions({ id, name, active }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);

    const res = await fetch(`/api/admin/templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });

    setBusy(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error ?? "No se pudo cambiar el estado.");
      return;
    }

    router.refresh();
  }

  async function remove() {
    if (!confirm(`¿Borrar la plantilla "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setBusy(true);

    const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });

    setBusy(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json.error ?? "No se pudo borrar.");
      return;
    }

    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={active ? "Ocultar" : "Activar"}
        title={active ? "Ocultar" : "Activar"}
        className={btn}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : active ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label="Borrar"
        title="Borrar"
        className={`${btn} hover:!bg-rose-500/20 hover:!text-rose-300`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}
