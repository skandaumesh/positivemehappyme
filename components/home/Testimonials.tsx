import { Ornament } from "@/components/art/Ornament";
import { Marquee } from "./Marquee";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

/** Messages from Neha's affirmation art workshop participants (wording as sent; greetings removed). */
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sukanya",
    highlight: "Small positive changes in my everyday routine",
    text: "Thank you so much for the wonderful session. I can already notice a few small positive changes in my everyday routine. Displaying my artwork as my wallpaper has been very motivating and makes me feel happy and inspired. Thank you once again!",
  },
  {
    name: "Dafni",
    highlight: "Something so powerful and intentional",
    text: "I just wanted to tell you how beautiful your manifesting art is. There’s something so powerful and intentional in the way you express your vision — you can truly feel the energy and clarity behind it. It’s not just visually stunning, but emotionally inspiring as well. Your work radiates positivity, purpose, and belief. Thank you for sharing your creativity and light — it genuinely uplifts and motivates others to believe in their own dreams too. Keep creating, because what you’re doing truly matters ✨❤️",
  },
  {
    name: "Angelina",
    highlight: "You captured a dream",
    text: "Thank you so much. Looking at it makes me feel inspired, motivated, and deeply connected to my goals. You didn’t just create art — you captured a dream and turned it into something I can see and feel every day. Thank you for helping me visualize my manifestations so powerfully. It truly means a lot to me. ✨",
  },
  {
    name: "Manjula",
    highlight: "Super inspiring",
    text: "The manifest workshop was super inspiring, loved exploring new mediums. Great balance of guidance and creative freedom.",
  },
];

export function Testimonials() {
  return (
    <section id="kind-words" className="bg-cream/70 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">Kind Words</p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight text-teal">
            Love from our <em className="text-maroon">workshop family</em>
          </h2>
          <Ornament className="mx-auto mt-6 w-44 text-gold" />
          <p className="mx-auto mt-5 max-w-xl text-ink-soft">
            What participants of Neha’s affirmation art workshops have shared with her.
          </p>
        </div>
      </div>

      {/* One full-width row of square cards that slowly scrolls on a loop */}
      <div className="mt-10">
        <Marquee label="Testimonials from workshop participants" seconds={40}>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
