import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finances citoyennes — Comprendre l’argent public",
  description: "Explorez les finances publiques du Québec : revenus, dépenses, dette et sources officielles, expliqués simplement.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body className="antialiased">{children}</body>
    </html>
  );
}
