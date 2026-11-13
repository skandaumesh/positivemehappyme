import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "@/components/art/Icons";
import { Mandala } from "@/components/art/Mandala";
import { EDITIONS, EDITION_KEYS, PRICES, formatINR, site } from "@/lib/site";
import { AddToCart } from "@/components/cart/AddToCart";

const LOOK = {
  kids: { panel: "bg-blush", label: "Kids Edition" },
  adults: { panel: "bg-champagne", label: "Adults Edition" },
} as const;

export function Editions() {
  return (
    <>
      <section id="editions" className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="eyebrow">Two Editions</p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight text-teal">
              Choose Your <em className="text-maroon">Daily Dose</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Each kit comes complete and ready to begin, with delivery included in the price.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
            {EDITION_KEYS.map((key) => {
              const ed = EDITIONS[key];
              const look = LOOK[key];
              const photo = site.images[key];
              return (
                <article
                  key={key}
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-champagne bg-white/70 shadow-[0_30px_60px_-40px_rgba(86,13,34,0.35)]"
                >
                  {/* Same 5:4 panel for photo and illustration so both cards line up */}
                  <div className={`relative aspect-[5/4] overflow-hidden ${look.panel}`}>
                    {photo ? (
                      <Image
                        src={photo}
                        alt={`${ed.fullName} kit: book, ${ed.includes[1].toLowerCase()} and take-along bag`}
                        fill
                        sizes="(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <Mandala className="pointer-events-none absolute -top-24 -right-24 w-64 opacity-25" />
                        <Image
                          src={site.images.pouch}
                          alt={`${ed.fullName} drawstring pouch`}
                          fill
                          sizes="(min-width: 768px) 360px, 80vw"
                          className="object-contain px-10 pt-8 pb-5 drop-shadow-[0_18px_22px_rgba(86,13,34,0.2)]"
                        />
                        <span className="absolute bottom-4 left-4 rounded-full border border-gold/60 bg-ivory/85 px-3 py-1 text-[0.65rem] font-bold tracking-[0.22em] text-teal uppercase">
                          {look.label}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-7 sm:p-9">
                    <p className="font-script text-2xl text-maroon">{ed.tagline}</p>
                    <h3 className="mt-1 font-serif text-2xl leading-snug text-teal sm:text-[1.75rem]">
                      {ed.fullName}
                    </h3>
                    <p className="mt-3 leading-relaxed text-ink-soft">{ed.description}</p>

                    <p className="mt-6 text-xs font-bold tracking-[0.22em] text-ink-soft uppercase">
                      What’s inside
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {ed.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-ink">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal text-ivory">
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-start justify-between gap-4 pt-8">
                      <div>
                        <p className="font-serif text-4xl font-bold text-maroon">{formatINR(PRICES[key])}</p>
                        <p className="mt-1 text-sm text-ink-soft">Free delivery included</p>
                      </div>
                      <AddToCart edition={key} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Delivery charges are included in the above prices. No additional delivery charges.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-maroon px-6 py-14 text-center text-ivory sm:px-12">
          <Mandala className="pointer-events-none absolute -bottom-40 -left-40 w-96 opacity-[0.12]" />
          <Mandala className="pointer-events-none absolute -top-40 -right-40 w-96 opacity-[0.12]" />
          <p className="relative font-script text-4xl text-gold-light">Order now</p>
          <h2 className="relative mt-2 font-serif text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight">
            A little happiness, delivered to your doorstep!
          </h2>
          <Link href="/cart" className="btn btn-gold relative mt-8">
            Order Your Daily Dose
          </Link>
        </div>
      </section>
    </>
  );
}
