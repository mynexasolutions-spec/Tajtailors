"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminLogin } from "@/actions/auth";
import { Mail, Lock, ShieldCheck, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ivory px-6 overflow-hidden">

      {/* Cinematic Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-gold-400/10 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fadeUp rounded-[2.5rem] border border-gold-400/20 bg-white p-8 sm:p-12 shadow-2xl transition-all duration-500 hover:border-gold-400/35">

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative group mb-5">
            <div className="absolute inset-0 rounded-full bg-gold-400/25 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gold-400/25 bg-ivory-deep p-2.5 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Taj Tailor"
                width={88}
                height={88}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Authorized Access Only
          </span>

          <h1 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
              Login
            </span>
          </h1>

          {/* Shimmering gold divider */}
          <div className="relative mt-5 h-px w-20 overflow-hidden rounded-full">
            <div
              className="h-full w-full animate-shimmer bg-gold-gradient bg-[length:200%_200%]"
              style={{ animationDuration: "6s" }}
            />
          </div>
        </div>

        {/* Form Section */}
        <form action={formAction} className="space-y-5">
          {state.error && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2 animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              {state.error}
            </div>
          )}

          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
            <input 
              required 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              className="w-full rounded-2xl border border-ink/10 bg-black/[0.025] pl-12 pr-5 py-4 text-sm text-ink placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500/60 group-focus-within:text-gold-600 transition-colors duration-300" />
            <input 
              required 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full rounded-2xl border border-ink/10 bg-black/[0.025] pl-12 pr-12 py-4 text-sm text-ink placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500/60 hover:text-gold-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={pending} 
            className="btn-gold group w-full py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                Checking Details...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Sign In
              </span>
            )}
          </button>
        </form>

        {/* Back to Shop Link */}
        <div className="mt-8 text-center border-t border-ink/10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-ink/45 hover:text-gold-600 transition-colors uppercase duration-300 group/btn"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
