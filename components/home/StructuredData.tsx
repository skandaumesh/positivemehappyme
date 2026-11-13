import { EDITIONS, EDITION_KEYS, PRICES, site } from "@/lib/site";

/**
 * schema.org JSON-LD for Google: the brand (Organization), the site, and both
 * editions as Products with price, free shipping in India and stock status.
 * Validate at https://search.google.com/test/rich-results
 */
export function StructuredData() {
  const u = (p = "") => `${site.url}${p}`;
  const orgId = u("/#organization");
  const founderId = u("/#neha-lal");

  const products = EDITION_KEYS.map((key) => {
    const ed = EDITIONS[key];
    return {
      "@type": "Product",
      "@id": u(`/#${key}-edition`),
      name: ed.fullName,
      description: `${ed.description} Includes: ${ed.includes.join(", ")}.`,
      image: [u(site.images[key] || site.images.hero), u(site.images.hero)],
      sku: `PMHM-${key.toUpperCase()}`,
      brand: { "@type": "Brand", name: site.name },
      category: "Colouring books",
      audience:
        key === "kids"
          ? { "@type": "PeopleAudience", audienceType: "Children" }
          : { "@type": "PeopleAudience", audienceType: "Adults" },
      offers: {
        "@type": "Offer",
        url: u("/#editions"),
        priceCurrency: "INR",
        price: PRICES[key].toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": orgId },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        },
      },
    };
  });

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        url: u(),
        logo: u(site.images.logo),
        image: u(site.images.hero),
        description: "A creative wellness brand bringing together colouring, affirmations, mindfulness and manifestation.",
        founder: { "@id": founderId },
        sameAs: [`https://www.instagram.com/${site.instagram}/`],
        ...(site.email ? { email: site.email } : {}),
      },
      {
        "@type": "Person",
        "@id": founderId,
        name: site.author,
        jobTitle: "Founder & Curator",
        description:
          "Curator of My Daily Dose of Affirmation and founder of Positive Me Happy Me. Neha runs affirmation art workshops that bring together creativity and positive thinking.",
        url: u("/#curator"),
        worksFor: { "@id": orgId },
        knowsAbout: ["Affirmations", "Manifestation", "Mindfulness", "Affirmation art", "Colouring"],
        sameAs: [`https://www.instagram.com/${site.instagram}/`],
      },
      {
        "@type": "WebSite",
        "@id": u("/#website"),
        url: u(),
        name: site.name,
        inLanguage: "en-IN",
        publisher: { "@id": orgId },
      },
      ...products,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so nothing in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
