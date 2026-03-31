import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A/B Price Testing Tool - Find Your Optimal Shopify Price",
  description:
    "Discover how much profit you could be leaving on the table. Interactive pricing simulator for Shopify merchants powered by ABConvert.",
  keywords:
    "Shopify pricing, A/B testing, price optimization, Shopify store optimization, conversion rate, pricing strategy, ABConvert",
  authors: [{ name: "ABConvert" }],
  creator: "ABConvert",
  publisher: "ABConvert",
  icons: {
    icon: "/company_icon.png",
    shortcut: "/company_icon.png",
    apple: "/company_icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "What if your price is wrong? | ABConvert",
    description:
      "A $5 price difference can mean $50,000/year in lost profit. See how much you could be missing.",
    type: "website",
    locale: "en_US",
    siteName: "ABConvert Price Testing Tool",
  },
  twitter: {
    card: "summary_large_image",
    title: "What if your price is wrong? | ABConvert",
    description:
      "A $5 price difference can mean $50,000/year in lost profit. See how much you could be missing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
