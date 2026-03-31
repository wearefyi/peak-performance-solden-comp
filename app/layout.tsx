import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peak Performance - Solden Mountain",
  description: "Submit your entry for the Peak Performance Solden Mountain competition.",
  icons: {
    icon: '/peakperformancelogo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
