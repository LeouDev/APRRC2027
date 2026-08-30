"use client";

import { useActionState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { loginAction, type LoginState } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />

      <div>
        <Label htmlFor="email" className="text-slate-200" required>
          Email
        </Label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@aprrc2027.org"
            className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-slate-200" required>
          Password
        </Label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Authorized event organizers only. Access is logged and rate-limited.
      </p>
    </form>
  );
}
