import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
        center: true,
        padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "rgba(var(--primary) / <alpha-value>)",
          light: "rgba(var(--primary-light) / <alpha-value> )",
        },
        border: "rgba(var(--border) / <alpha-value>)",
        input: "rgba(var(--input) / <alpha-value>)",
        ring: "rgba(var(--ring) / <alpha-value>)",
        background: "rgba(var(--background) / <alpha-value>)",
        foreground: "rgba(var(--foreground) / <alpha-value>)",
        destructive: {
          DEFAULT: "rgba(var(--destructive) / <alpha-value>)",
          foreground: "rgba(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgba(var(--muted) / <alpha-value>)",
          foreground: "rgba(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgba(var(--accent) / <alpha-value>)",
          foreground: "rgba(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgba(var(--popover) / <alpha-value>)",
          foreground: "rgba(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgba(var(--card) / <alpha-value>)",
          foreground: "rgba(var(--card-foreground) / <alpha-value>)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
