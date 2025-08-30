import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./styles/globals.css";

const nunito = Nunito({
  variable: "--font-family-nunito",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Criollazo - Juego de Palabras Venezolanas",
  description: "Adivina palabras venezolanas en este juego inspirado en Wordle. Palabras como AREPA, CHAMO, VAINA y más. ¡Échale bolas y juega!",
  keywords: "wordle, venezuela, palabras, juego, arepa, venezolano, criollo, vaina, chamo",
  authors: [{ name: "Criollazo Team" }],
  openGraph: {
    title: "Criollazo - Juego de Palabras Venezolanas",
    description: "Adivina palabras venezolanas en este juego inspirado en Wordle. ¡Échale bolas!",
    type: "website",
    locale: "es_VE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Criollazo - Juego de Palabras Venezolanas",
    description: "Adivina palabras venezolanas en este juego inspirado en Wordle. ¡Échale bolas!",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-VE">
      <body className={`${nunito.className}`}>
        {children}
      </body>
    </html>
  );
}
