import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-3xl font-bold text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-white">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-lg leading-relaxed text-slate-300">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-lg text-slate-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-lg text-slate-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-cyan-400/60 bg-white/[0.03] py-3 pl-5 pr-4 text-slate-200 [&>p]:my-1">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  a: ({ href = "", children }) => {
    const className = "text-cyan-300 underline underline-offset-2 hover:text-cyan-200";
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}