import Image from "next/image";

export default function LoadingSpinner({ fullScreen = true, label = "Loading" }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-ivory ${
        fullScreen ? "min-h-screen" : "min-h-[40vh] py-20"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-[120px]" />
      </div>

      <div className="relative flex h-36 w-36 items-center justify-center">
        {/* Static ring */}
        <span className="absolute inset-0 rounded-full border-2 border-gold-400/15" />
        {/* Spinning gold arc */}
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-500 border-r-gold-500/40"
          style={{ animationDuration: "1.3s" }}
        />
        {/* Pulsing glow behind the logo */}
        <span className="absolute h-24 w-24 animate-pulse rounded-full bg-gold-400/20 blur-xl" />
        {/* Logo */}
        <div className="relative h-20 w-20 animate-floatSlow">
          <Image src="/logo.png" alt="Taj Tailor" fill className="object-contain" priority />
        </div>
      </div>

      <p className="relative mt-7 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-600/80 animate-pulse">
        {label}
      </p>
    </div>
  );
}
