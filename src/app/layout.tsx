import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SLAY Writer — AI LinkedIn Post Generator",
  description:
    "Generate high-performing LinkedIn posts in seconds using the SLAY Framework. Two tones, one click: Expert Authority & Relatable Human.",
  openGraph: {
    title: "SLAY Writer — AI LinkedIn Post Generator",
    description:
      "Generate high-performing LinkedIn posts using the SLAY Framework.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${caveat.variable} font-sans antialiased bg-black text-zinc-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
