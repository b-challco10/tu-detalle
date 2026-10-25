import { redirect } from "next/navigation";

import { getAdminStatus } from "@/lib/admin";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Acceso | TuDetalle",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const status = await getAdminStatus();

  if (status === "admin") {
    redirect("/admin/plantillas");
  }

  const { error } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080810] px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-emerald-400/15 blur-[120px]" />
      </div>

      <LoginForm forbidden={status === "forbidden" || error === "forbidden"} />
    </main>
  );
}
