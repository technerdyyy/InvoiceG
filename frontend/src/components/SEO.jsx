import React from "react";
import { Helmet } from "@vuer-ai/react-helmet-async";

const SEO = ({
  title = "InvoiceGen - Professional Invoice Generator",
  description = "Generate professional invoices quickly and easily with InvoiceGen. Secure, fast, and user-friendly invoice generator for businesses of all sizes.",
  keywords = "invoicegen.dotdevz.com, invoicegen dotdevz, invoice generator, billing, business invoices, PDF invoices, professional invoicing, GST invoices",
  canonicalUrl,
  ogImage = "/invoiceg.svg",
  type = "website",
}) => {
  const siteUrl = "https://invoicegen.dotdevz.com";
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="InvoiceGen" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="DotDevz" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};

export default SEO;
