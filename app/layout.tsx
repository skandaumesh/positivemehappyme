import type { Metadata, Viewport } from "next";
import { DM_Sans, Great_Vibes, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Positive Me Happy Me — My Daily Dose of Affirmation",
  description:
    "Make space for positivity, one affirmation at a time. My Daily Dose of Affirmation by Neha Lal — an affirmation colouring experience for kids and adults. ₹399 with free delivery.",
  openGraph: {
    title: "Positive Me Happy Me — My Daily Dose of Affirmation",
    description:
      "Relax your mind. Colour your thoughts. Affirm your dreams. Kids & Adults editions, ₹399 with free delivery.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${greatVibes.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
