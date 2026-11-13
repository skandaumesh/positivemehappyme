"use client";

import { useRef } from "react";

/**
 * Payment-screenshot thumbnail that opens full size in an on-page viewer
 * (no new tab, no storage URL). Images come from /admin/screenshot/[id].
 */
export function ScreenshotViewer({ orderId, code }: { orderId: string; code: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const src = `/admin/screenshot/${orderId}`;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group shrink-0 text-left"
        aria-label={`View payment screenshot for ${code}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-protected image */}
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-36 w-24 rounded-xl bg-cream object-cover ring-1 ring-champagne transition group-hover:ring-2 group-hover:ring-maroon sm:h-40 sm:w-28"
        />
        <span className="mt-1 block text-center text-xs text-ink-soft group-hover:text-maroon">Tap to enlarge</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Payment screenshot for ${code}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close(); // click on the backdrop
        }}
        className="m-auto max-h-[95dvh] w-[min(560px,94vw)] overflow-hidden rounded-[1.5rem] bg-ivory p-0 shadow-2xl backdrop:bg-ink/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-champagne px-4 py-3">
          <p className="font-serif text-lg font-bold text-teal">
            {code} <span className="font-sans text-sm font-normal text-ink-soft">· payment screenshot</span>
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none text-ink-soft transition-colors hover:bg-blush hover:text-maroon"
          >
            ×
          </button>
        </div>
        <div className="max-h-[calc(95dvh-8rem)] overflow-auto bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-protected image */}
          <img src={src} alt={`Payment screenshot for ${code}`} className="mx-auto h-auto w-full rounded-lg" />
        </div>
        <div className="flex justify-end gap-2 border-t border-champagne px-4 py-3">
          <a href={`${src}?download=1`} className="btn btn-outline px-4 py-2 text-sm">
            Download
          </a>
          <button type="button" onClick={() => dialogRef.current?.close()} className="btn btn-primary px-5 py-2 text-sm">
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
