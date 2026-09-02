import { useEffect } from "react";

/**
 * Dynamic SEO & AI Head Manager Component for Sheher Saathi (Shehar App)
 * Dynamically modifies document title, meta tags, and JSON-LD schema on page changes.
 */
export default function SEOHead({
  title = "Sheher Saathi (Shehar App) — Har Sheher. Apna Sa. | Urban Travel & Transport Companion",
  description = "Sheher Saathi (Shehar App) is India's premier smart city travel companion. Explore 140+ Jaipur heritage places, real-time JCTSL city bus schedules, Pink Line Metro routes, auto cab fare comparison, verified local food, and royal hotel stays.",
  keywords = "Sheher Saathi, Shehar Saathi, Shehar App, Sheher App, Jaipur travel app, Jaipur city bus app, Jaipur metro app, Jaipur transport app, Jaipur heritage guide, Jaipur 140 places, Ghumo Jaipur, Hawa Mahal, Amer Fort, Jaipur hotel booking",
  canonicalUrl = "https://shehersaathi.com/",
  schemaData = null
}) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    }

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    }

    // Inject Page-Specific JSON-LD Schema
    let existingPageSchema = document.getElementById("dynamic-page-schema");
    if (existingPageSchema) {
      existingPageSchema.remove();
    }

    if (schemaData) {
      const script = document.createElement("script");
      script.id = "dynamic-page-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById("dynamic-page-schema");
      if (script) script.remove();
    };
  }, [title, description, keywords, canonicalUrl, schemaData]);

  return null;
}
