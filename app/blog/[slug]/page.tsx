import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-slate-950">
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20">
          <p className="text-sm text-slate-500">
            <Link href="/blog" className="hover:text-cyan-300">
              Blog
            </Link>{" "}
            / {post.category}
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-slate-500">
            {formatDate(post.date)} · {post.readingMinutes} min de lectura
          </p>

          <div className="mt-8">
            <Markdown content={post.content} />
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Convierte tus palabras en un detalle
            </h2>
            <p className="mt-3 text-slate-300">
              Crea una dedicatoria con fotos, música y animaciones y compártela
              con un enlace.
            </p>
            <Link
              href="/plantillas"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Ver plantillas
            </Link>
          </div>

          {/* Relacionados */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-white">Sigue leyendo</h2>
              <ul className="mt-6 space-y-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-lg text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                    >
                      {p.title}
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