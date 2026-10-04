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
  metadataBase: new URL("https://www.tu-detalle.com"),

  title: {
    default: "Tu Detalle | Cartas y Regalos Digitales Personalizados",
    template: "%s | Tu Detalle",
  },

  description:
    "Crea detalles y cartas digitales personalizadas con fotos, música, mensajes e interacciones únicas para sorprender a tu pareja o amigos.",

  keywords: [
    "regalos personalizados",
    "detalles románticos",
    "cartas digitales",
    "regalos virtuales de aniversario",
    "cartas de amor interactivas",
    "detalles con fotos y música",
    "tu detalle",
  ],

  authors: [{ name: "Tu Detalle" }],
  creator: "Tu Detalle",
  publisher: "Tu Detalle",
  applicationName: "Tu Detalle",

  alternates: {
    canonical: "https://www.tu-detalle.com",
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
    title: "Tu Detalle | Cartas y Regalos Digitales Personalizados",
    description:
      "Crea detalles únicos con fotos, mensajes y música personalizada para ocasiones especiales.",
    url: "https://www.tu-detalle.com",
    siteName: "Tu Detalle",
    locale: "es_ES",
    type: "website",

    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Plataforma de regalos y cartas digitales personalizadas - Tu Detalle",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tu Detalle | Cartas y Regalos Digitales Personalizados",
    description:
      "Crea detalles únicos con fotos, mensajes y música personalizada para ocasiones especiales.",
    images: ["/og-banner.png"],
  },
  other: {
    "google-adsense-account": "ca-pub-3770775034295435",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tu Detalle",
    url: "https://www.tu-detalle.com",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description:
      "Plataforma web para personalizar cartas y detalles digitales interactivos.",
  };

  return (
    <html lang="es">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3770775034295435"
          crossOrigin="anonymous"
        />
      </head>
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
