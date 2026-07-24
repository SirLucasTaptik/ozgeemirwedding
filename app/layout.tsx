import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Özge & Emir Wedding",
  description: "20 September 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
