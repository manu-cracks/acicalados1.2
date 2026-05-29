import type { Metadata } from "next";
import { Rye, DM_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Rye({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-display'
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: "Asistencia - Acicalados",
  description: "Sistema de control de asistencia vintage para Spa & Barbería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${displayFont.variable} ${sansFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
