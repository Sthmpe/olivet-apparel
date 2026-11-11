"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="mt-16 max-w-sm rounded-[1.5rem] border border-edge bg-card p-8">
      <h1 className="font-display text-3xl text-fg">Welcome back</h1>
      <label htmlFor="password" className="mt-6 block text-xs uppercase tracking-[0.18em] text-muted">
        Studio password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-2 w-full rounded-xl border border-edge bg-page px-4 py-3 text-fg focus:border-gold focus:outline-none"
      />
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-gold-light">
          {state.error}
        </p>
      )}
      <button className="btn-gold mt-6 w-full" disabled={pending}>
        {pending ? "Opening…" : "Enter the studio"}
      </button>
    </form>
  );
}
