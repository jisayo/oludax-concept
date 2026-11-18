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
          DEFAULT: "#C40E75", // Canva authentic signature Rich Berry Magenta
          hover: "#D91B86",
          secondary: "#E01E8B",
          soft: "#FDE8F2",
          light: "#FFF5F9",
          plum: "#720D46",
          rose: "#F68EA8",
          blush: "#F2B0C0",
        },
        pink: {
          DEFAULT: "#C40E75",
          hover: "#D91B86",
          secondary: "#E01E8B",
          soft: "#FDE8F2",
          light: "#FFF5F9",
          rose: "#F68EA8",
          blush: "#F2B0C0",
        },
        plum: {
          DEFAULT: "#720D46",
          dark: "#4A072C",
          light: "#8F1559",
        },
        canva: {
          berry: "#C40E75",
          plum: "#720D46",
          wine: "#B4136E",
          rose: "#F68EA8",
          blush: "#F2B0C0",
          cyan: "#00C2E4",
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
