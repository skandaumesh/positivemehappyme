import Image from "next/image";
import { InstagramIcon } from "@/components/art/Icons";
import { Ornament } from "@/components/art/Ornament";
import { site } from "@/lib/site";

const GRATITUDE = [
  "Thank you, thank you, thank you, the road is clear and I didn’t face any traffic today!",
  "Thank you, thank you, thank you, I found parking exactly where I wanted!",
];

/** "Meet the Curator" — Neha's story. Text only (no portrait), with mandala decoration. */
export function Curator() {
  return (
    <section id="curator" className="relative overflow-hidden bg-blush/30 py-20 sm:py-24 lg:py-28">
      <Image
        src={site.images.mandala}
        alt=""
        aria-hidden="true"
        width={1254}
        height={1254}
        sizes="(min-width: 768px) 380px, 220px"
        className="pointer-events-none absolute -top-28 -right-28 w-[220px] animate-[spin_180s_linear_infinite] opacity-90 md:-top-40 md:-right-40 md:w-[380px]"
      />
      <Image
        src={site.images.mandala}
        alt=""
        aria-hidden="true"
        width={1254}
        height={1254}
        sizes="(min-width: 768px) 380px, 220px"
        className="pointer-events-none absolute -bottom-28 -left-28 w-[220px] animate-[spin_220s_linear_infinite_reverse] opacity-90 md:-bottom-40 md:-left-40 md:w-[380px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="eyebrow">Meet the Curator</p>
        <h2 className="mt-5 font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] leading-tight text-teal">{site.author}</h2>
        <p className="mt-2 font-serif text-lg text-maroon italic">
          Curator of <span className="whitespace-nowrap">My Daily Dose of Affirmation</span> · Founder of @{site.instagram}
        </p>
        <Ornament className="mx-auto mt-6 w-44 text-gold" />

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            Neha Lal is the visionary behind @{site.instagram}, a space she has envisioned to help people release,
            create and reaffirm their thoughts, and consciously manifest the life they wish for.
          </p>
          <p>
            Through her affirmation art workshops and her book, <em className="text-ink">My Daily Dose of Affirmation</em>,
            Neha brings together the power of creativity and positive thinking. She believes that every piece of art you
            create, whether in the pages of her book or at one of her workshops, becomes more than just an artwork. It
            becomes a daily reminder of your intentions, dreams and the life you are creating for yourself.
          </p>
        </div>

        {/* IMPOSSIBLE → I AM POSSIBLE */}
        <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-gold/40 bg-ivory/85 px-6 py-7">
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-serif">
            <span className="text-2xl tracking-[0.18em] text-ink-soft/60 sm:text-3xl">IMPOSSIBLE</span>
            <span aria-hidden="true" className="text-2xl text-gold">→</span>
            <span className="text-2xl font-bold tracking-[0.12em] text-maroon sm:text-3xl">I AM POSSIBLE</span>
          </p>
          <p className="mt-3 text-ink-soft">
            A person who looks at the word IMPOSSIBLE and sees I AM POSSIBLE, Neha strongly believes in the power of
            words.
          </p>
        </div>

        <figure className="mt-12">
          <blockquote className="font-serif text-[clamp(1.6rem,3.6vw,2.3rem)] leading-snug text-teal italic">
            “Speak what you want, not what you don’t want.”
          </blockquote>
          <figcaption className="mt-2 text-sm font-semibold tracking-[0.2em] text-ink-soft uppercase">
            Her philosophy — simple yet powerful
          </figcaption>
        </figure>

        <p className="mt-12 text-lg leading-relaxed text-ink-soft">
          For Neha, affirmations are not just about manifesting the big dreams. They are about bringing gratitude and
          positivity into everyday life. It could be as simple as saying:
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {GRATITUDE.map((line) => (
            <li
              key={line}
              className="rounded-2xl border border-champagne bg-white/85 px-5 py-4 font-serif leading-relaxed text-ink italic shadow-[0_16px_30px_-26px_rgba(86,13,34,0.5)]"
            >
              “{line}”
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            She believes that when we consciously choose our words, thoughts and intentions, we begin to shift the way
            we experience life.
          </p>
          <p>
            Through Positive Me Happy Me, Neha hopes to inspire people to make affirmations a part of their everyday
            lives, because manifestation isn’t just about wishing for a better tomorrow; it’s about consciously creating
            it,
          </p>
        </div>
        <p className="mt-3 font-script text-[clamp(1.9rem,4.5vw,2.6rem)] leading-tight text-maroon">
          one thought, one word and one affirmation at a time.
        </p>

        <a
          href={`https://www.instagram.com/${site.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline mt-9"
        >
          <InstagramIcon className="h-5 w-5" /> Follow @{site.instagram}
        </a>
      </div>
    </section>
  );
}
