import Image from "next/image";
import { site } from "@/lib/site";

export function Book() {
  return (
    <section id="book" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
        {/* A page from the book, shown like a sheet of paper on a blush card */}
        <div className="order-2 md:order-1">
          <div className="relative mx-auto w-full max-w-[440px]">
            <div aria-hidden="true" className="absolute inset-[6%] -rotate-6 rounded-[1.75rem] bg-blush" />
            <Image
              src={site.images.book}
              alt="A page from My Daily Dose of Affirmation: the affirmation “I never give up” on a mandala, half coloured in and half waiting to be coloured"
              width={1254}
              height={1254}
              sizes="(min-width: 768px) 440px, 90vw"
              className="relative h-auto w-full rotate-2 rounded-[1.5rem] border border-champagne bg-white shadow-[0_30px_60px_-30px_rgba(86,13,34,0.4)]"
            />
          </div>
        </div>

        <div className="order-1 text-center md:order-2 md:text-left">
          <p className="eyebrow">Introducing</p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] text-teal">
            Make Every Moment a Little More Meaningful.
          </h2>
          <p className="mt-5 text-sm font-bold tracking-[0.28em] text-maroon uppercase">
            My Daily Dose of Affirmation
          </p>
          <p className="mt-6 font-serif text-xl leading-relaxed text-ink italic">
            What if your everyday relaxation could also become an opportunity to manifest the life you
            desire?
          </p>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              My Daily Dose of Affirmation is more than a colouring book. It is a little reminder to
              pause, release what doesn’t serve you and consciously fill your mind with thoughts that
              uplift and empower you.
            </p>
            <p>
              As you colour each page, let go of the unwanted, embrace the positive and connect with
              affirmations that reflect the life you wish to create.
            </p>
          </div>
          <p className="mt-7 font-script text-[clamp(1.9rem,4.5vw,2.6rem)] leading-tight text-maroon">
            Relax your mind. Colour your thoughts. Affirm your dreams.
          </p>
          <p className="mt-4 text-ink-soft">
            Because every moment of letting go can become a beautiful opportunity to begin again.
          </p>
          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-teal uppercase">
            By {site.author}
          </p>
        </div>
      </div>
    </section>
  );
}
