import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem",
      },
      boxShadow: {
        glow: "0 0 80px rgba(56, 189, 248, 0.18)",
        glass: "0 20px 80px rgba(0, 0, 0, 0.32)",
      },
      backgroundImage: {
        "radial-spotlight":
          "radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.18), transparent 35%), radial-gradient(circle at 75% 0%, rgba(168, 85, 247, 0.16), transparent 30%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
