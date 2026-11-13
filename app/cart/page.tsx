import type { Metadata } from "next";
import Link from "next/link";
import { Ornament } from "@/components/art/Ornament";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";

export const metadata: Metadata = {
  title: "Your Cart — Positive Me Happy Me",
  description: "Review your Daily Dose of Affirmation, share your delivery details and pay by UPI.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream/60 pt-10 pb-20 sm:pt-14 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link href="/#editions" className="text-sm font-semibold text-teal hover:underline">
            ← Continue shopping
          </Link>
          <div className="mt-6 text-center">
            <p className="eyebrow">Your Cart</p>
            <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-tight text-teal">
              Your Daily Dose Is Just <em className="text-maroon">a Few Steps Away!</em>
            </h1>
            <Ornament className="mx-auto mt-5 w-44 text-gold" />
          </div>
          <CheckoutForm />
        </div>
      </main>
      <Footer compact />
    </>
  );
}
