import { createClient } from "@/lib/supabase/server";

export type AdminStatus = "admin" | "forbidden" | "anon";

/**
 * - "anon":      no hay sesión
 * - "forbidden": hay sesión, pero NO es el correo definido en ADMIN_EMAIL
 * - "admin":     eres tú
 */
export async function getAdminStatus(): Promise<AdminStatus> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "anon";

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (adminEmail && user.email?.toLowerCase() === adminEmail) {
    return "admin";
  }

  return "forbidden";
}

export async function isAdmin() {
  return (await getAdminStatus()) === "admin";
}
