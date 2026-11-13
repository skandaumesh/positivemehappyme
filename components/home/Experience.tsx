import { FeatherIcon, HeartIcon, LotusIcon, SparkleIcon } from "@/components/art/Icons";
import { Mandala } from "@/components/art/Mandala";
import { Ornament } from "@/components/art/Ornament";

const STEPS = [
  { title: "Release", text: "Let go of everyday stress and unwanted thoughts.", Icon: FeatherIcon },
  { title: "Relax", text: "Immerse yourself in the calming joy of colouring.", Icon: LotusIcon },
  {
    title: "Reaffirm",
    text: "Fill the space with positive affirmations and empowering thoughts.",
    Icon: HeartIcon,
  },
  {
    title: "Manifest",
    text: "Visualise and invite the possibilities you wish to create in your life.",
    Icon: SparkleIcon,
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-teal-deep py-20 text-ivory sm:py-24 lg:py-28">
      <Mandala className="pointer-events-none absolute -top-56 -right-56 w-[520px] opacity-[0.08]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow text-gold-light">The Experience</p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Release. Relax. Reaffirm. <em className="text-gold-light">Manifest.</em>
          </h2>
          <Ornament className="mx-auto mt-6 w-44 text-gold" />
        </div>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className="group relative rounded-[1.75rem] border border-gold/30 bg-white/[0.04] p-7 transition-colors hover:bg-white/[0.08]"
            >
              <span className="absolute top-6 right-7 font-serif text-sm text-gold-light/70">
                0{i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/50 text-gold-light">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-serif text-2xl">{title}</h3>
              <p className="mt-2 leading-relaxed text-ivory/80">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
