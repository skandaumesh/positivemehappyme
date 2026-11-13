"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Tone = "primary" | "danger";

/**
 * A button that asks "Are you sure?" in an on-page dialog before running a
 * server action. Hidden `fields` are sent with the form.
 */
export function ConfirmAction({
  action,
  fields,
  trigger,
  triggerClassName,
  title,
  message,
  confirmLabel,
  tone = "primary",
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  trigger: ReactNode;
  triggerClassName: string;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  tone?: Tone;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");

  const open = () => {
    setError("");
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  async function run(formData: FormData) {
    try {
      await action(formData);
      close();
    } catch {
      setError("That didn’t save. Please check your connection and try again.");
    }
  }

  return (
    <>
      <button type="button" onClick={open} className={triggerClassName}>
        {trigger}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[min(420px,92vw)] rounded-[1.5rem] bg-ivory p-0 shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <form action={run} className="p-6">
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <h2 className="font-serif text-xl font-bold text-teal">{title}</h2>
          <div className="mt-2 text-sm leading-relaxed text-ink-soft">{message}</div>
          {error ? (
            <p role="alert" className="mt-3 text-sm font-medium text-maroon">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={close} className="btn px-4 py-2 text-sm text-ink-soft ring-1 ring-champagne hover:text-ink">
              Cancel
            </button>
            <ConfirmButton tone={tone}>{confirmLabel}</ConfirmButton>
          </div>
        </form>
      </dialog>
    </>
  );
}

function ConfirmButton({ tone, children }: { tone: Tone; children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      autoFocus
      className={`btn px-5 py-2 text-sm ${
        tone === "danger" ? "bg-maroon-deep text-ivory hover:bg-maroon" : "btn-primary"
      }`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
