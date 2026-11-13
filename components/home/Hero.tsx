import Image from "next/image";
import { Ornament } from "@/components/art/Ornament";
import { priceLabel, site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_25%,rgb(246_220_214/0.95),transparent_70%),radial-gradient(45%_40%_at_5%_95%,rgb(234_217_189/0.8),transparent_70%)]"
      />
      {/* Painted folk mandala (public/images/mandala.png) in the top-left and bottom-right corners */}
      <Image
        src={site.images.mandala}
        alt=""
        aria-hidden="true"
        width={1254}
        height={1254}
        priority
        sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 280px"
        className="pointer-events-none absolute -top-40 -left-40 w-[280px] animate-[spin_160s_linear_infinite] sm:-top-48 sm:-left-48 sm:w-[400px] lg:-top-52 lg:-left-56 lg:w-[440px]"
      />
      <Image
        src={site.images.mandala}
        alt=""
        aria-hidden="true"
        width={1254}
        height={1254}
        sizes="480px"
        className="pointer-events-none absolute -right-40 -bottom-48 hidden w-[440px] animate-[spin_200s_linear_infinite_reverse] md:block lg:-right-44 lg:-bottom-52 lg:w-[480px]"
      />

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

        {/* Book cover, shown like the real flip-book: tilted, with the pink back cover behind */}
        <div className="relative mx-auto w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[230px]">
          <div aria-hidden="true" className="absolute -inset-8 rounded-full bg-blush blur-3xl" />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-2 rotate-3 rounded-[1.25rem] bg-[#f2b3c2] shadow-[0_20px_40px_-20px_rgba(86,13,34,0.4)]"
          />
          <Image
            src={site.images.hero}
            alt="My Daily Dose of Affirmations book cover — a creative journey towards positivity, self-love and mindful living. Affirmation art by Neha Lal."
            width={800}
            height={1600}
            priority
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 200px, 180px"
            className="relative h-auto w-full -rotate-2 rounded-[1.25rem] shadow-[0_30px_60px_-24px_rgba(86,13,34,0.55)] ring-1 ring-black/5"
          />
        </div>
      </div>
    </section>
  );
}
