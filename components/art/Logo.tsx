import Image from "next/image";

/** Brand mark (wings emblem cropped from /images/logo.jpeg) + wordmark. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={44}
        height={44}
        priority
        className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-blush-deep/60 sm:h-11 sm:w-11"
      />
      <span className="flex flex-col font-serif leading-[1.05] font-bold tracking-[0.14em]">
        <span className="text-[0.82rem] text-teal sm:text-[0.9rem]">POSITIVE ME</span>
        <span className="text-[0.82rem] text-maroon sm:text-[0.9rem]">HAPPY ME</span>
      </span>
    </span>
  );
}
