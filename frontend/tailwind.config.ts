import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundPrimary: "var(--color-bg-primary)",
        backgroundSecondary: "var(--color-bg-secondary)",
        textPrimary: "var(--color-text-primary)",
        colorPrimary: "var(--color-primary)",
        colorPecondary: "var(--color-secondary)",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      fontFamily: {
        league: ["league-spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
