import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Markdown } from "@/components/blog/Markdown";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

const SITE = "https://www.tu-detalle.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: `${post.title} | TuDetalle`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: "TuDetalle", url: SITE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#080810]">
        {/* Resplandores: dan algo que desenfocar detrás del vidrio */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute -left-32 top-1/3 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-1/4 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[120px]" />
        </div>

        <article className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 md:pt-32">
          {/* Migas de pan */}
          <nav
            aria-label="Ruta"
            className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400"
          >
            <Link href="/blog" className="transition-colors hover:text-cyan-300">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-0.5 text-xs font-medium text-cyan-200">
              {post.category}
            </span>
          </nav>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(post.date)} · {post.readingMinutes} min de lectura
          </p>

          {/* Contenido sobre vidrio */}
          <div className="glass-card mt-8 px-6 py-4 md:px-10 md:py-6">
            <Markdown content={post.content} />
          </div>

          {/* CTA */}
          <div className="glass-card relative mt-16 overflow-hidden p-8 text-center md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-emerald-400/20" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/25 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-emerald-400/25 blur-[80px]" />

            <div className="relative">
              <h2 className="text-2xl font-bold text-white">
                Convierte tus palabras en un detalle
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-200">
                Crea una dedicatoria con fotos, música y animaciones y
                compártela con un enlace.
              </p>
              <Link
                href="/plantillas"
                className="btn-gradient-animated group mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.03]"
              >
                Ver plantillas
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Relacionados */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-white">Sigue leyendo</h2>

              <ul className="mt-6 grid gap-4">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="glass-card group flex items-center justify-between gap-4 px-6 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_12px_30px_rgba(34,211,238,0.15)]"
                    >
                      <span className="text-lg font-medium text-slate-100 transition-colors group-hover:text-cyan-200">
                        {p.title}
                      </span>
                      <ArrowRight className="h-5 w-5 shrink-0 text-cyan-300 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}