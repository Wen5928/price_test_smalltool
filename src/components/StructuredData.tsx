export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "A/B Price Testing Tool",
    "description": "Professional A/B price testing calculator to compare conversion rates, revenue, and profit between different price points. Make data-driven pricing decisions.",
    "url": "https://yourwebsite.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "ABConvert",
      "url": "https://yourwebsite.com"
    },
    "featureList": [
      "A/B price comparison",
      "Conversion rate calculation",
      "Revenue analysis",
      "Profit optimization",
      "Interactive charts",
      "Real-time calculations"
    ],
    "screenshot": "https://yourwebsite.com/screenshot.png"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}