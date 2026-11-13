import { Mandala } from "@/components/art/Mandala";
import { Ornament } from "@/components/art/Ornament";

const PILLARS = ["Relaxation", "Mindfulness", "Affirmation", "Manifestation"];

export function Philosophy() {
  return (
    <>
      <section id="philosophy" className="bg-cream/70 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="eyebrow">Our Philosophy</p>
          <h2 className="mt-5 font-serif text-[clamp(1.9rem,5vw,3.1rem)] leading-tight text-teal">
            But when we release what weighs us down,{" "}
            <em className="text-maroon">what do we fill that space with?</em>
          </h2>
          <Ornament className="mx-auto mt-6 w-44 text-gold" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              At Positive Me Happy Me, we believe in consciously filling that space with positivity,
              beautiful thoughts and empowering affirmations.
            </p>
            <p>
              Through the simple joy of colouring and the power of positive words, we bring together
              relaxation, mindfulness, affirmation and manifestation.
            </p>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {PILLARS.map((p) => (
              <li
                key={p}
                className="rounded-full border border-gold/50 bg-ivory px-5 py-2 font-serif text-teal italic"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-maroon-deep py-20 text-center sm:py-24">
        <Mandala className="pointer-events-none absolute top-1/2 left-1/2 w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Ornament className="mx-auto w-40 text-gold-light" />
          <blockquote className="mt-8 font-serif text-[clamp(1.5rem,4vw,2.6rem)] leading-snug text-ivory italic">
            “Because it’s not just about letting go of negativity. It’s about choosing what we invite
            into our minds and lives next.”
          </blockquote>
          <p className="mt-6 font-script text-3xl text-gold-light">Positive Me Happy Me</p>
        </div>
      </section>
    </>
  );
}
