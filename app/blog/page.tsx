import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Ideas para dedicatorias, cartas y detalles | TuDetalle",
  description:
    "Ideas, frases y guías para escribir dedicatorias y cartas de amor, y sorprender a tu pareja, familia o amigos en fechas especiales.",
  alternates: { canonical: "https://www.tu-detalle.com/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#080810]">
        {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute -left-32 top-1/2 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-20 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 md:pt-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Ideas, frases y guías para escribir dedicatorias, cartas y
              detalles que se queden en el corazón de quien los recibe.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 text-center text-slate-300">
              Pronto publicaremos nuestros primeros artículos.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="glass-card group flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_40px_rgba(34,211,238,0.18)]"
                >
                  <span className="w-fit rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {post.category}
                  </span>

                  <h2 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-cyan-200">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-300">
                    {post.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(post.date)} · {post.readingMinutes} min
                    </span>

                    <span className="flex items-center gap-1 font-medium text-cyan-300">
                      Leer
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}