import type { Metadata, Viewport } from "next";
import { DM_Sans, Great_Vibes, Playfair_Display } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

/** ~60 chars with the brand — what Google shows as the blue link. */
const SEO_TITLE = "Affirmation Colouring Book for Kids & Adults";
/** Longer title for WhatsApp/Instagram/Facebook previews. */
const SHARE_TITLE = "My Daily Dose of Affirmation — Affirmation Colouring Kits for Kids & Adults";
/** ~155 chars — the grey text under the link in Google. */
const DESCRIPTION =
  "My Daily Dose of Affirmation by Neha Lal — an affirmation colouring kit for kids & adults with colours and a take-along bag. ₹399, free delivery. Pay by UPI.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${SEO_TITLE} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: DESCRIPTION,
  applicationName: site.name,
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.name,
  category: "shopping",
  keywords: [
    "affirmation colouring book",
    "colouring book for adults",
    "kids affirmation book",
    "positive affirmations",
    "mindfulness colouring",
    "manifestation book",
    "self-love gift",
    "My Daily Dose of Affirmation",
    "Positive Me Happy Me",
    "Neha Lal",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: SHARE_TITLE,
    description:
      "Relax your mind. Colour your thoughts. Affirm your dreams. Kids & Adults editions — ₹399 with free delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: "Affirmation colouring kits for kids & adults by Neha Lal. ₹399 with free delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  // Optional: Search Console "HTML tag" verification (the Domain/DNS method doesn't need this).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${greatVibes.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
