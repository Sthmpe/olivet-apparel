"use client";

import { useActionState } from "react";
import { signIn, type StudioActionState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<StudioActionState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-14 max-w-sm rounded-3xl bg-card p-8">
      <h1 className="font-display text-3xl text-fg">Welcome back</h1>
      <label htmlFor="password" className="mt-6 block text-sm font-medium">
        Studio password
      </label>
      <input id="password" name="password" type="password" required autoComplete="current-password" className="field mt-2 !bg-page" />
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}
      <button className="btn btn-primary mt-6 w-full" disabled={pending}>
        {pending ? "Opening" : "Enter the studio"}
      </button>
    </form>
  );
}
