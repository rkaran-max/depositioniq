import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DepositionIQ",
  description: "Agentic litigation analysis for deposition review.",
  icons: {
    icon: "/brand/depositioniq-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
