"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400/70 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]";

export function LoginForm({ forbidden }: { forbidden: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    forbidden ? "Esta cuenta no tiene acceso al panel." : null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.replace("/admin/plantillas");
    router.refresh();
  }

  return (
    <div className="glass-card relative w-full max-w-sm p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
          <Heart className="h-6 w-6 text-white" fill="currentColor" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-white">Panel de plantillas</h1>
        <p className="mt-1 text-sm text-slate-300">Solo para el administrador</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Correo
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Contraseña
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient-animated flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Entrar
        </button>
      </form>
    </div>
  );
}
