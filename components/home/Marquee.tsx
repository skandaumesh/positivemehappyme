import type { CSSProperties, ReactNode } from "react";

/**
 * A single row that scrolls sideways on a loop. `children` must be <li> items.
 * Pauses while hovered, pressed (touch) or when something inside has focus;
 * with "reduce motion" it becomes a normal horizontally scrollable row instead.
 */
export function Marquee({ children, label, seconds = 45 }: { children: ReactNode; label: string; seconds?: number }) {
  return (
    <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] motion-reduce:overflow-x-auto">
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] active:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-duration": `${seconds}s` } as CSSProperties}
      >
        <ul aria-label={label} className="flex shrink-0 gap-6 pr-6">
          {children}
        </ul>
        {/* Second copy makes the loop seamless; inert = not focusable, hidden from screen readers */}
        <ul inert className="flex shrink-0 gap-6 pr-6 motion-reduce:hidden">
          {children}
        </ul>
      </div>
    </div>
  );
}
