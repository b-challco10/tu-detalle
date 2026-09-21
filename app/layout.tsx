import "./globals.css";

import { Geist, Playfair_Display } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}