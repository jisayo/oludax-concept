import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--color-base) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        cloud: "rgb(var(--color-cloud) / <alpha-value>)",
        accent: {
          DEFAULT: "#F42E91",
          hover: "#FF4D9E",
          secondary: "#FF75B5",
          soft: "#FCE4EF",
          light: "#FFF8FB",
        },
        pink: {
          DEFAULT: "#F42E91",
          secondary: "#FF75B5",
          soft: "#FCE4EF",
          light: "#FFF8FB",
        },
        dark: {
          DEFAULT: "#0B0B0D",
          plum: "#1C141E",
          soft: "#241828",
        },
        brand: {
          bg: "rgb(var(--color-base) / <alpha-value>)",
          line: "rgb(var(--color-border) / 0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Fraunces", "Georgia", "serif"],
        body: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: [
          "'IBM Plex Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
export default config;
