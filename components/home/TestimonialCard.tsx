"use client";

import { useRef } from "react";

export type Testimonial = { name: string; highlight: string; text: string };

/** Longer messages are clamped in the square card; "Read more" opens the full text. */
const LONG = 170;

function Signature({ name }: { name: string }) {
  return (
    <span className="block text-left">
      <span className="block font-script text-3xl leading-none text-maroon">{name}</span>
      <span className="mt-1 block text-[0.7rem] font-bold tracking-[0.2em] text-ink-soft uppercase">
        Workshop participant
      </span>
    </span>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isLong = t.text.length > LONG;

  return (
    <li className="w-[300px] shrink-0 sm:w-[360px]">
      <figure className="relative flex aspect-square flex-col overflow-hidden rounded-[1.75rem] border border-champagne bg-white/90 p-6 shadow-[0_24px_48px_-36px_rgba(86,13,34,0.45)] sm:p-7">
        <span aria-hidden="true" className="absolute -top-3 right-5 font-serif text-[7rem] leading-none text-gold/25">
          “
        </span>
        <p className="relative pr-8 font-serif text-lg leading-snug text-teal italic sm:text-xl">{t.highlight}</p>
        <blockquote
          className={`relative mt-2 text-[0.95rem] leading-relaxed text-ink-soft ${isLong ? "line-clamp-4 sm:line-clamp-5" : ""}`}
        >
          {t.text}
        </blockquote>
        {isLong ? (
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="mt-1 self-start text-sm font-semibold text-maroon underline-offset-4 hover:underline"
          >
            Read more
          </button>
        ) : null}
        <figcaption className="mt-auto border-t border-dashed border-champagne pt-4">
          <Signature name={t.name} />
        </figcaption>
      </figure>

      {isLong ? (
        <dialog
          ref={dialogRef}
          aria-label={`Message from ${t.name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) e.currentTarget.close();
          }}
          className="m-auto w-[min(520px,92vw)] rounded-[1.75rem] bg-ivory p-0 shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
        >
          <div className="relative p-7 sm:p-8">
            <span aria-hidden="true" className="block font-serif text-6xl leading-[0.6] text-gold">
              “
            </span>
            <p className="mt-3 font-serif text-xl leading-snug text-teal italic">{t.highlight}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">{t.text}</p>
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-dashed border-champagne pt-5">
              <Signature name={t.name} />
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="btn btn-primary px-5 py-2 text-sm"
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </li>
  );
}
