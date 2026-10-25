import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Heart } from "lucide-react";

import { getAdminStatus } from "@/lib/admin";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Admin | TuDetalle",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await getAdminStatus();

  if (status === "anon") redirect("/admin/login");
  if (status === "forbidden") redirect("/admin/login?error=forbidden");

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080810]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/plantillas" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400">
              <Heart className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <span className="font-bold">
              Admin{" "}
              <span className="font-normal text-slate-400">· Plantillas</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:text-cyan-300 sm:flex"
            >
              Ver sitio
              <ExternalLink className="h-4 w-4" />
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
