import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
};

/**
 * Contenedor para páginas legales (privacidad, términos).
 * Usa colores heredados para que funcione con tu tema claro u oscuro.
 */
export default function LegalLayout({ title, updated, children }: Props) {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "48px 20px 80px",
        lineHeight: 1.75,
        fontSize: 17,
      }}
    >
      <p style={{ margin: 0, opacity: 0.7 }}>
        <Link href="/" style={{ color: "inherit" }}>
          Volver al inicio
        </Link>
      </p>

      <h1 style={{ fontSize: "2.2rem", lineHeight: 1.2, margin: "16px 0 8px" }}>
        {title}
      </h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Última actualización: {updated}</p>

      <div className="legal-body">{children}</div>

      <style>{`
        .legal-body h2 { font-size: 1.3rem; margin: 2.2rem 0 0.5rem; }
        .legal-body p, .legal-body li { margin: 0.6rem 0; }
        .legal-body ul { padding-left: 1.3rem; }
        .legal-body a { color: inherit; text-decoration: underline; }
      `}</style>
    </main>
  );
}