import Link from "next/link";
import { Logo } from "@/components/art/Logo";
import { CartButton } from "@/components/cart/CartButton";

const NAV = [
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#book", label: "The Book" },
  { href: "/#experience", label: "Experience" },
  { href: "/#editions", label: "Editions" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" aria-label="Positive Me Happy Me — home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium text-ink-soft lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-maroon">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <Link href="/#editions" className="btn btn-primary px-4 py-2.5 text-sm sm:px-5">
            Order Now
          </Link>
        </div>
      </div>
    </header>
  );
}
