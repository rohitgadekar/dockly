/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        luxury: {
          gold: "#D4AF37",
          cream: "#F5F5DC",
          obsidian: "#0B0B0B",
          slate: "#1A1A1A",
        }
      },
      fontFamily: {
        syncopate: ["Syncopate", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        plus: ["Plus Jakarta Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        syne: ["Syne", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
        bodoni: ["Bodoni Moda", "serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
