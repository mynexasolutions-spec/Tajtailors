"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { register } from "@/actions/auth";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-black/[0.025] py-4 pl-12 pr-4 text-base text-ink placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [state, formAction, pending] = useActionState(register, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-md animate-fadeUp rounded-[2.5rem] border border-gold-400/20 bg-white p-8 sm:p-12 shadow-2xl transition-all duration-500 hover:border-gold-400/35">

      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/10 blur-3xl" />

      <div className="relative flex items-center justify-center gap-2.5">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold-500/70" />
        <span className="eyebrow text-[11px] font-semibold uppercase tracking-widest text-gold-600">
          Join Taj Tailor
        </span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold-500/70" />
      </div>
      <h1 className="relative mt-3 text-center font-display text-3xl sm:text-4xl font-bold text-ink">
        Create an{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700">
          Account
        </span>
      </h1>
      <p className="relative mt-3 text-center text-base text-ink/55 font-light">Faster checkout and order tracking, every visit.</p>

      <form action={formAction} className="relative mt-9 space-y-4">
        <input type="hidden" name="redirect_to" value={redirectTo} />
        {state.error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            {state.error}
          </div>
        )}

        {/* Name Input */}
        <div className="relative group">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input required name="full_name" placeholder="Full Name" className={inputClass} />
        </div>

        {/* Email Input */}
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
        </div>

        {/* Phone Input */}
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input name="phone" type="tel" placeholder="Phone Number" className={inputClass} />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
          <input
            required
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password (min. 6 chars)"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500/60 hover:text-gold-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="btn-gold group w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              Creating account…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <UserPlus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              Create Account
            </span>
          )}
        </button>
      </form>

      <div className="relative mt-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink/30">or</span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <p className="relative mt-6 text-center text-base text-ink/55 font-light">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-gold-600 hover:text-gold-700 transition-colors font-medium"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
