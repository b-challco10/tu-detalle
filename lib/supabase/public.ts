import { createServerClient } from "@supabase/ssr";

/**
 * Cliente de SOLO LECTURA pública, sin cookies.
 * Al no tocar cookies(), las páginas públicas (home, plantillas...) pueden
 * seguir siendo estáticas y rápidas.
 */
export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* no-op */
        },
      },
    }
  );
}
