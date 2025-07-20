import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEOHead({
  title = 'BIANOTRADES - Secure Cryptocurrency Trading Platform',
  description = 'Buy and sell Bitcoin, Ethereum, USDT, and BNB securely with BIANOTRADES. Fast transactions, competitive rates, and 24/7 support.',
  keywords = 'cryptocurrency, bitcoin, ethereum, crypto trading, buy bitcoin, sell bitcoin, crypto exchange, digital currency',
  image = '/og-image.jpg',
  url = 'https://bianotrades.com'
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BIANOTRADES" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="BIANOTRADES" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": "BIANOTRADES",
          "description": description,
          "url": url,
          "logo": `${url}/logo.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "customer service",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://twitter.com/bianotrades",
            "https://facebook.com/bianotrades",
            "https://linkedin.com/company/bianotrades"
          ]
        })}
      </script>
    </Helmet>
  );
}