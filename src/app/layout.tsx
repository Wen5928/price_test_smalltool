import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A/B Price Testing Tool - Optimize Your Pricing Strategy",
  description: "Professional A/B price testing calculator to compare conversion rates, revenue, and profit between different price points. Make data-driven pricing decisions.",
  keywords: "A/B testing, price optimization, conversion rate calculator, pricing strategy, revenue calculator, profit analysis",
  authors: [{ name: "ABConvert" }],
  creator: "ABConvert",
  publisher: "ABConvert",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "A/B Price Testing Tool - Optimize Your Pricing Strategy",
    description: "Professional A/B price testing calculator to compare conversion rates, revenue, and profit between different price points.",
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    siteName: "A/B Price Testing Tool",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "A/B Price Testing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A/B Price Testing Tool - Optimize Your Pricing Strategy",
    description: "Professional A/B price testing calculator to compare conversion rates, revenue, and profit between different price points.",
    images: ["https://yourwebsite.com/twitter-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
