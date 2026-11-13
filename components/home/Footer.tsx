import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/art/Icons";
import { Mandala } from "@/components/art/Mandala";
import { Ornament } from "@/components/art/Ornament";
import { site } from "@/lib/site";

/** `compact` drops the closing brand message (used on the cart page). */
export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="relative mt-auto overflow-hidden bg-teal-deep text-ivory">
      <Mandala className="pointer-events-none absolute -bottom-64 left-1/2 w-[640px] -translate-x-1/2 opacity-[0.07]" />

      {compact ? null : (
      <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-14 text-center sm:px-6 sm:pt-24">
        <Ornament className="mx-auto w-40 text-gold" />
        <h2 className="mt-6 font-serif text-[clamp(2.2rem,6vw,3.6rem)] leading-tight">
          Let Go. Fill Up. <em className="text-gold-light">Grow Happy.</em>
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ivory/80">
          <p>
            You deserve moments that make you feel lighter, thoughts that make you feel stronger and
            reminders that help you believe in yourself.
          </p>
          <p>
            So take a little pause, pick up your colours and give yourself a daily dose of positivity.
          </p>
        </div>
        <p className="mt-8 font-script text-[clamp(1.6rem,4vw,2.2rem)] leading-snug text-gold-light">
          Because the space you create within yourself deserves to be filled with something beautiful.
        </p>
        <Link href="/cart" className="btn btn-gold mt-10">
          Order Your Daily Dose
        </Link>
      </div>
      )}

      <div className="relative border-t border-ivory/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Image
              src={site.images.logo}
              alt="Positive Me Happy Me by Neha Lal"
              width={128}
              height={128}
              className="h-28 w-28 rounded-2xl shadow-lg ring-1 ring-ivory/15"
            />
            <div>
              <p className="font-serif text-lg font-bold tracking-[0.12em]">POSITIVE ME HAPPY ME</p>
              <p className="mt-1 text-sm text-ivory/70">Created with love by {site.author}.</p>
            </div>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <li>
              <a
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ivory/85 transition-colors hover:text-gold-light"
              >
                <InstagramIcon className="h-5 w-5" /> @{site.instagram}
              </a>
            </li>
            {site.whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ivory/85 transition-colors hover:text-gold-light"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
                </a>
              </li>
            ) : null}
            {site.email ? (
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-ivory/85 transition-colors hover:text-gold-light"
                >
                  <MailIcon className="h-5 w-5" /> {site.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <p className="pb-8 text-center text-xs text-ivory/50">
          Copyright © 2026 Positive Me Happy Me. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
