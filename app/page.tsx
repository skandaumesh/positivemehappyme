import { CartBar } from "@/components/cart/CartBar";
import { Book } from "@/components/home/Book";
import { Curator } from "@/components/home/Curator";
import { Editions } from "@/components/home/Editions";
import { Experience } from "@/components/home/Experience";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { HowToOrder } from "@/components/home/HowToOrder";
import { Philosophy } from "@/components/home/Philosophy";
import { StructuredData } from "@/components/home/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <Book />
        <Experience />
        <Curator />
        <Editions />
        <HowToOrder />
      </main>
      <Footer />
      <CartBar />
    </>
  );
}
