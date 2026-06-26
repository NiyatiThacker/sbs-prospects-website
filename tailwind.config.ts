import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        "sbs-navy": "#000613",
        "sbs-navy-container": "#001f3f",

        "sbs-gold": "#e9c349",
        "sbs-gold-light": "#fed65b",
        "sbs-gold-muted": "#735c00",

        "sbs-cream": "#fff8ef",

        "sbs-surface": "#fbf3e4",
        "sbs-surface-mid": "#f5edde",
        "sbs-surface-high": "#efe7d9",

        "sbs-white": "#ffffff",

        "sbs-charcoal": "#1e1b13",
        "sbs-charcoal-light": "#43474e",

        "sbs-outline": "#74777f",
        "sbs-outline-light": "#c4c6cf",

        "sbs-hero": "#b8ab9e", 
      },

      maxWidth: {
        container: "1200px",
      },

      spacing: {
        section: "120px",
      },

      fontFamily: {
        playfair: ["var(--font-playfair)"],
        inter: ["var(--font-inter)"],
      },

      boxShadow: {
        ambient: "0 8px 32px rgba(0, 6, 19, 0.06)",
      },

      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [],
};

export default config;