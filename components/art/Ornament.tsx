/** Gold filigree divider with a heart, echoing the invite. Colour via `text-*`. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} fill="none" aria-hidden="true">
      <path d="M2 12 H92" stroke="currentColor" strokeWidth="1" />
      <path d="M148 12 H238" stroke="currentColor" strokeWidth="1" />
      <path d="M92 12 l5 -4 l5 4 l-5 4 z" fill="currentColor" />
      <path d="M138 12 l5 -4 l5 4 l-5 4 z" fill="currentColor" />
      <path
        d="M106 12 c4 -6 8 -6 10 -2 M134 12 c-4 -6 -8 -6 -10 -2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M120 19 C111 13 110 6.5 115 5.5 C117.6 5 119.3 6.6 120 8.2 C120.7 6.6 122.4 5 125 5.5 C130 6.5 129 13 120 19 Z"
        fill="currentColor"
      />
    </svg>
  );
}
