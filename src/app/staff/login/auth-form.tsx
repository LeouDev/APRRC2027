"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { staffLoginAction, staffSignupAction, type AuthState } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const INPUT = "mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-slate-500";

export function StaffAuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signup ? staffSignupAction : staffLoginAction,
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-md">
        <p role="status" className="text-sm text-emerald-300">
          {state.success}
        </p>
        <Link href="/staff/login" className="mt-5 inline-block text-sm font-semibold text-amber-400">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md">
      {signup && (
        <div>
          <Label htmlFor="name" className="text-slate-200" required>
            Your Name
          </Label>
          <Input id="name" name="name" required maxLength={100} autoComplete="name" className={INPUT} />
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-slate-200" required>
          Email
        </Label>
        <Input id="email" name="email" type="email" required autoComplete="username" className={INPUT} />
      </div>

      <div>
        <Label htmlFor="password" className="text-slate-200" required>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={signup ? 8 : undefined}
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder={signup ? "At least 8 characters" : undefined}
          className={INPUT}
        />
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
        {signup ? "Create Account" : "Sign In"}
      </button>

      <p className="text-center text-sm text-slate-400">
        {signup ? (
          <>
            Already approved?{" "}
            <Link href="/staff/login" className="font-semibold text-amber-400">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New scanner?{" "}
            <Link href="/staff/login?signup=1" className="font-semibold text-amber-400">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
