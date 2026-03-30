import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PastranaRun App",
  description: "MVP mobile-first para planificacion de entrenamientos de running",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}