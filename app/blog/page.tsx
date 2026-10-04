import type { Metadata } from "next";
import Link from "next/link";
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

      <main className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Ideas, frases y guías para escribir dedicatorias, cartas y detalles
              que se queden en el corazón de quien los recibe.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 text-center text-slate-400">
              Pronto publicaremos nuestros primeros artículos.
            </p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-cyan-400/40"
                >
                  <span className="text-sm font-medium text-cyan-400">
                    {post.category}
                  </span>

                  <h2 className="mt-3 text-xl font-semibold text-white group-hover:text-cyan-200">
                    {post.title}
                  </h2>

                  <p className="mt-3 flex-1 text-slate-400">{post.description}</p>

                  <p className="mt-5 text-sm text-slate-500">
                    {formatDate(post.date)} · {post.readingMinutes} min de lectura
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}