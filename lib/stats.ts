import { createPublicClient } from "@/lib/supabase/public";

/**
 * El contador de "detalles creados" solo se muestra cuando llega a este número.
 * Un número bajo ("12 detalles") le quita confianza al sitio.
 * Ponlo en 0 si quieres que se vea siempre.
 */
export const MIN_COUNT_TO_SHOW = 100;

async function getCreatedCount(): Promise<number | null> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase.rpc("dedicatorias_count");

    if (error) {
      console.error("Error leyendo el contador de detalles:", error.message);
      return null;
    }

    const count = Number(data);

    return Number.isFinite(count) ? count : null;
  } catch (error) {
    console.error("Error leyendo el contador de detalles:", error);
    return null;
  }
}

// 1234 -> "1.234"
function withDots(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Número de detalles creados, redondeado hacia abajo (1.234 -> 1.200).
 * Devuelve null si todavía no hay suficientes o si falló la consulta.
 */
export async function getCreatedRounded(): Promise<number | null> {
  const count = await getCreatedCount();

  if (count === null || count <= 0 || count < MIN_COUNT_TO_SHOW) {
    return null;
  }

  const step = count >= 1000 ? 100 : 10;

  return Math.floor(count / step) * step;
}

/** Texto listo para mostrar, por ejemplo "+1.200". */
export async function getCreatedLabel(): Promise<string | null> {
  const rounded = await getCreatedRounded();

  return rounded === null ? null : `+${withDots(rounded)}`;
}