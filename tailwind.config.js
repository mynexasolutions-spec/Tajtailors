/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12100e",
          soft: "#1c1815",
          line: "#322a21",
        },
        ivory: {
          DEFAULT: "#ffffff",
          deep: "#f5f5f5",
        },
        gold: {
          50: "#faf3df",
          100: "#f1d989",
          200: "#e6c674",
          300: "#dcb35f",
          400: "#caa14b",
          500: "#b3893a",
          600: "#a97c2f",
          700: "#8a6626",
          DEFAULT: "#caa14b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1360px",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #a97c2f 0%, #f1d989 45%, #caa14b 70%, #8a6626 100%)",
        "ink-gradient": "linear-gradient(180deg, #12100e 0%, #201c18 100%)",
      },
      boxShadow: {
        gold: "0 20px 60px -20px rgba(202,161,75,0.35)",
        soft: "0 24px 60px -24px rgba(18,16,14,0.12)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(48px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1.08) translate(0, 0)" },
          "100%": { transform: "scale(1.16) translate(-1%, -1%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(.22,1,.36,1) forwards",
        shimmer: "shimmer 5s ease-in-out infinite alternate",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        slideInRight: "slideInRight 0.5s cubic-bezier(.22,1,.36,1) forwards",
        kenBurns: "kenBurns 16s ease-out infinite alternate",
      },
    },
  },
  plugins: [],
};
