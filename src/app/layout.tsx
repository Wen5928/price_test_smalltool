import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from "@/components/ErrorBoundary";
import DebugPanel from "@/components/DebugPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify A/B Price Testing Tool - CSV Data Analysis for Store Optimization",
  description: "Professional Shopify-specific A/B price testing tool. Upload your Shopify product CSV exports to analyze optimal pricing strategies, compare conversion rates, revenue, and profit across different price points. Designed exclusively for Shopify merchants.",
  keywords: "Shopify pricing, A/B testing, Shopify CSV analysis, price optimization, Shopify store optimization, conversion rate calculator, Shopify merchants, pricing strategy",
  authors: [{ name: "ABConvert" }],
  creator: "ABConvert",
  publisher: "ABConvert",
  icons: {
    icon: '/company_icon.png',
    shortcut: '/company_icon.png',
    apple: '/company_icon.png',
  },
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
    title: "Shopify A/B Price Testing Tool - CSV Data Analysis for Store Optimization",
    description: "Professional Shopify-specific A/B price testing tool. Upload your Shopify product CSV exports to analyze optimal pricing strategies. Designed exclusively for Shopify merchants.",
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    siteName: "Shopify A/B Price Testing Tool",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shopify A/B Price Testing Tool for CSV Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify A/B Price Testing Tool - CSV Data Analysis for Store Optimization",
    description: "Professional Shopify-specific A/B price testing tool. Upload your Shopify product CSV exports to analyze optimal pricing strategies. Designed exclusively for Shopify merchants.",
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            removeDelay: 200, // Faster removal animation
            style: {
              background: 'var(--color-surface)',
              color: 'var(--foreground)',
              border: '1px solid var(--color-border)',
            },
            success: {
              duration: 3000,
              removeDelay: 150, // Even faster for success messages
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--foreground)',
              },
            },
            error: {
              duration: 5000,
              removeDelay: 200,
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--foreground)',
              },
            },
          }}
          reverseOrder={false}
        />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <DebugPanel />
      </body>
    </html>
  );
}
