import { Mandala } from "./Mandala";

/** A half-coloured affirmation page with pencils — stands in for the inside-page photo. */
export function ColouringPage({ className = "" }: { className?: string }) {
  const pencils = [
    { color: "#7b1631", rotate: -18, bottom: "6%", right: "-4%" },
    { color: "#0f5c5a", rotate: -26, bottom: "12%", right: "-8%" },
    { color: "#c4623a", rotate: -10, bottom: "1%", right: "2%" },
  ];
  return (
    <div className={`@container relative mx-auto w-full max-w-[440px] ${className}`}>
      <div className="absolute inset-[6%] -rotate-6 rounded-[1.75rem] bg-blush" aria-hidden="true" />
      <div className="relative rotate-2 rounded-[1.5rem] border border-champagne bg-white p-[7cqw] shadow-[0_30px_60px_-30px_rgba(86,13,34,0.35)]">
        <div className="relative mx-auto aspect-square w-full">
          <Mandala variant="line" strokeColor="#5b4741" className="absolute inset-0 h-full w-full" />
          {/* the coloured-in half */}
          <div className="absolute inset-0 [clip-path:polygon(0_0,58%_0,42%_100%,0_100%)]">
            <Mandala className="h-full w-full" />
          </div>
        </div>
        <p className="mt-[5cqw] text-center font-script text-[9cqw] leading-none text-maroon">
          I am calm. I am enough.
        </p>
        <p className="mt-[2cqw] text-center text-[3cqw] font-semibold tracking-[0.3em] text-ink-soft uppercase">
          Release · Relax · Reaffirm
        </p>
      </div>
      {pencils.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute h-[3.2cqw] w-[48cqw] origin-right rounded-r-sm shadow-md"
          style={{
            bottom: p.bottom,
            right: p.right,
            transform: `rotate(${p.rotate}deg)`,
            background: `linear-gradient(180deg, ${p.color} 0 30%, color-mix(in srgb, ${p.color} 75%, black) 30% 70%, ${p.color} 70%)`,
          }}
        >
          <span
            className="absolute top-0 left-[-7cqw] h-full w-[7cqw] [clip-path:polygon(100%_0,100%_100%,0_50%)]"
            style={{ background: `linear-gradient(90deg, ${p.color} 0 22%, #ead9bd 22%)` }}
          />
        </div>
      ))}
    </div>
  );
}
