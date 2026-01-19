import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect with your favorite tools and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
