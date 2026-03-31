import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
  title: "SLAY Writer - AI LinkedIn Post Generator",
  description:
    "Turn your story into a viral LinkedIn post in seconds. Fill in 4 fields, get 2 scroll-stopping posts using the proven SLAY Framework.",
  keywords: ["LinkedIn post generator", "AI writing tool", "LinkedIn growth", "SLAY framework", "social media content"],
  openGraph: {
    title: "SLAY Writer - AI LinkedIn Post Generator",
    description: "Turn your story into a viral LinkedIn post in seconds.",
    url: "https://slay-writer.vercel.app",
    siteName: "SLAY Writer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SLAY Writer - AI LinkedIn Post Generator",
    description: "Turn your story into a viral LinkedIn post in seconds.",
    images: ["https://slay-writer.vercel.app/slay-writer-twitter-thumbnail.png"],
  },
  verification: {
    google: "4asAj2rab3m6Ze69Oit0RN8lPYIx0HscDjhi0nNVmFo",
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
