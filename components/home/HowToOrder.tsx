import Link from "next/link";
import { BagIcon, CheckIcon, UploadIcon } from "@/components/art/Icons";
import { Ornament } from "@/components/art/Ornament";

const STEPS = [
  { title: "Add to cart", text: "Pick the Kids or Adults edition — or both.", Icon: BagIcon },
  { title: "Share your details", text: "Name, mobile, email and your Google Maps location.", Icon: CheckIcon },
  { title: "Pay via UPI", text: "Scan the QR with GPay, PhonePe, Paytm or any UPI app.", Icon: QrIcon },
  { title: "Upload screenshot", text: "Add your payment screenshot and submit. That’s it!", Icon: UploadIcon },
];

function QrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
    </svg>
  );
}

export function HowToOrder() {
  return (
    <section id="order" className="bg-cream/70 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">How to Order</p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight text-teal">
            Your Daily Dose Is Just <em className="text-maroon">a Few Steps Away!</em>
          </h2>
          <Ornament className="mx-auto mt-6 w-44 text-gold" />
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, text, Icon }, i) => (
            <li key={title} className="rounded-[1.5rem] border border-champagne bg-white/80 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-maroon text-sm font-bold text-ivory">
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-teal" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-teal">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#editions" className="btn btn-outline">
              Choose your edition
            </a>
            <Link href="/cart" className="btn btn-primary">
              <BagIcon className="h-5 w-5" /> Go to cart
            </Link>
          </div>
          <p className="max-w-xl text-center text-sm text-ink-soft">
            UPI payments only · No cash on delivery or card payments · Orders are confirmed after we
            verify your payment.
          </p>
        </div>
      </div>
    </section>
  );
}
