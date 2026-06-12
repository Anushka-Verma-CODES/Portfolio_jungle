import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anushka | Interactive Portfolio",
  description:
    "A cinematic portfolio landing page with a floating low-poly jungle island.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
