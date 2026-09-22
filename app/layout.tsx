import "./globals.css";

import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tu-detalle.com"),

  title: {
    default: "Tu Detalle | Detalles y regalos personalizados",
    template: "%s | Tu Detalle",
  },

  description:
    "Crea detalles personalizados con fotos, música, mensajes y experiencias únicas para sorprender a quienes más quieres.",

  keywords: [
    "regalos personalizados",
    "detalles románticos",
    "cartas digitales",
    "regalos online",
    "sorpresas personalizadas",
    "tu detalle",
  ],

  authors: [{ name: "Tu Detalle" }],

  creator: "Tu Detalle",
  publisher: "Tu Detalle",
  applicationName: "Tu Detalle",

  alternates: {
    canonical: "https://tu-detalle.com",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: "/logo1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/logo1.png"],
    apple: ["/logo1.png"],
  },

  openGraph: {
    title: "Tu Detalle | Regalos y Experiencias Digitales",
    description:
      "Crea experiencias únicas con fotos, mensajes y música personalizada.",
    url: "https://tu-detalle.com",
    siteName: "Tu Detalle",
    locale: "es_ES",
    type: "website",

    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Tu Detalle - Regalos personalizados",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tu Detalle | Regalos Personalizados",
    description:
      "Crea experiencias únicas con fotos, mensajes y música personalizada.",
    images: ["/logo1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tu Detalle",
    url: "https://tu-detalle.com",
    logo: "https://tu-detalle.com/logo1.png",
  };

  return (
    <html lang="es">
      <body className={geist.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
        {children}
      </body>
    </html>
  );
}