import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Only the home page is indexable (cart and admin are noindex). Images help Google Images. */
export default function sitemap(): MetadataRoute.Sitemap {
  const img = (p: string) => `${site.url}${p}`;
  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        img(site.images.hero),
        img(site.images.kids),
        img(site.images.adults),
        img(site.images.pouch),
        img(site.images.logo),
      ],
    },
  ];
}
