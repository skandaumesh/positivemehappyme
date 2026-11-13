import Image from "next/image";
import { Mandala } from "@/components/art/Mandala";
import { Ornament } from "@/components/art/Ornament";
import { priceLabel, site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_25%,rgb(246_220_214/0.95),transparent_70%),radial-gradient(45%_40%_at_5%_95%,rgb(234_217_189/0.8),transparent_70%)]"
      />
      <Mandala className="pointer-events-none absolute -top-40 -left-40 w-[280px] animate-[spin_160s_linear_infinite] opacity-90 sm:-top-48 sm:-left-48 sm:w-[400px] lg:-top-52 lg:-left-56" />
      <Mandala className="pointer-events-none absolute -right-40 -bottom-48 hidden w-[440px] animate-[spin_200s_linear_infinite_reverse] opacity-80 md:block" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-24 pb-20 sm:px-6 sm:pt-28 md:grid-cols-[1.1fr_0.9fr] md:pt-20 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-ivory/80 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-teal uppercase sm:text-xs">
            <span className="text-gold">✦</span> Now launching · My Daily Dose of Affirmation
          </p>

          <h1 className="mt-7 font-serif text-[clamp(2.6rem,11vw,3.6rem)] leading-[0.95] font-bold tracking-tight whitespace-nowrap md:text-[clamp(3.2rem,6.4vw,5.2rem)]">
            <span className="block text-teal">POSITIVE ME</span>
            <span className="block text-maroon">HAPPY ME</span>
          </h1>
          <Ornament className="mx-auto mt-5 w-52 text-gold md:mx-0" />

          <p className="brush mt-6 inline-block px-6 py-2.5 font-serif text-lg text-maroon italic sm:text-xl">
            Make Space for Positivity. One Affirmation at a Time.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:mx-0">
            Life gets busy. Our minds get crowded with thoughts, worries and emotions. Sometimes, all
            we need is a moment to pause, let go and make space for something better.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a href="#book" className="btn btn-outline">
              Discover the Book
            </a>
            <a href="#editions" className="btn btn-primary">
              Order Your Copy
            </a>
          </div>
          <p className="mt-5 text-sm text-ink-soft">
            {priceLabel()} · Free delivery · Pay easily by UPI
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px]">
          <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-blush blur-2xl" />
          <Image
            src={site.images.pouch}
            alt="My Daily Dose of Affirmation drawstring pouch by Neha Lal"
            width={991}
            height={1186}
            priority
            sizes="(min-width: 640px) 380px, 320px"
            className="relative h-auto w-full -rotate-2 drop-shadow-[0_28px_30px_rgba(86,13,34,0.22)]"
          />
        </div>
      </div>
    </section>
  );
}
