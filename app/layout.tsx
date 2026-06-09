import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dev10-sys.vercel.app"),
  title: {
    default: "Dev10-sys - Software Developer",
    template: "%s | Dev10-sys",
  },
  description:
    "Software Developer | GSoC & Summer of Bitcoin Contributor | Building secure software solutions, Bitcoin applications, and AI-driven systems.",
  keywords: [
    "Bitcoin Developer",
    "Blockchain Developer",
    "Bitcoin Jobs",
    "Summer of Bitcoin",
    "Google Summer of Code",
    "PSBT Signing",
    "Cryptography",
    "Dev10-sys",
    "Bitcoin Engineer",
    "Lightning Network",
    "Cryptocurrency Developer",
    "Open Source Contributor",
    "Blockchain Engineer",
    "Bitcoin Programming",
    "Software Engineer",
  ],
  authors: [{ name: "Dev10-sys", url: "https://github.com/Dev10-sys" }],
  creator: "Dev10-sys",
  publisher: "Dev10-sys",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dev10-sys.vercel.app",
    title: "Dev10-sys - Software Developer",
    description:
      "Software Developer with expertise in blockchain, cryptography, and secure applications. GSoC & Summer of Bitcoin contributor.",
    siteName: "Dev10-sys Portfolio",
    images: [
      {
        url: "/images/dev.png",
        width: 1200,
        height: 630,
        alt: "Dev - Engineering Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev10-sys - Software Developer",
    description:
      "Software Developer | GSoC & Summer of Bitcoin Contributor",
    creator: "@Dev10_shadow",
    images: ["/images/dev.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CursorGlow } from "@/components/cursor-glow";
import { GlobalBackground } from "@/components/global-background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-hidden`}>
        <GlobalBackground />
        <Suspense fallback={null}>
          <main className="h-screen w-screen overflow-hidden">
            {children}
          </main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
