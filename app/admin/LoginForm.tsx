"use client";

import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/art/Icons";
import { Logo } from "@/components/art/Logo";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center px-4 py-16">
      <form
        action={action}
        className="w-full max-w-sm rounded-[2rem] border border-champagne bg-white p-8 shadow-[0_30px_60px_-40px_rgba(86,13,34,0.45)]"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-center font-serif text-2xl text-teal">Orders admin</h1>
        <p className="mt-1 text-center text-sm text-ink-soft">Log in to view and manage orders.</p>

        <label htmlFor="email" className="mt-8 mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          autoFocus
          defaultValue={state.email}
          className="input"
          aria-invalid={Boolean(state.error)}
        />

        <label htmlFor="password" className="mt-5 mb-1.5 block text-sm font-semibold">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            className="input pr-12"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute inset-y-0 right-1 my-auto grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-blush hover:text-maroon focus-visible:outline-2 focus-visible:outline-maroon"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {state.error ? (
          <p id="password-error" role="alert" className="mt-2 text-sm font-medium text-maroon">
            {state.error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full">
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
