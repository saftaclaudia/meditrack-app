/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "hover:bg-primary-soft",
    "hover:bg-danger-soft",
    "hover:bg-soft-hoverLight",
    "hover:bg-soft-hoverDark",
    "bg-primary-soft",
    "text-primary",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "sans-serif"],
      },

      colors: {
        primary: {
          DEFAULT: "#00AEBB",
          hover: "#0099AA",
          soft: "#CCF3F7",       // teal tint — light mode
          softDark: "#003D47",   // teal tint — dark mode
        },

        background: {
          light: "#f8fafc",
          dark: "#0B1120",       // deeper dark for more contrast
        },

        surface: {
          light: "#ffffff",
          dark: "#162032",       // slightly lighter than bg
          cardLight: "#ffffff",
          cardDark: "#1C2B3A",   // card on dark bg
          mutedLight: "#f1f5f9",
          mutedDark: "#243447",
        },

        border: {
          light: "#e2e8f0",
          dark: "#2A3F52",
          subtleLight: "#f1f5f9",
          accentLight: "#7FE8F0",
          accentDark: "#00AEBB",  // teal border visible on dark
        },

        text: {
          primary: "#0f172a",
          darkPrimary: "#E8F8FB",  // slight teal tint on white

          secondary: "#475569",
          darkSecondary: "#8BBCC8",

          muted: "#94a3b8",
          darkMuted: "#5A7A8A",

          icon: "#64748b",
          iconDark: "#8BBCC8",

          body: "#1e293b",
          bodyDark: "#C5DDE5",
        },

        soft: {
          light: "#CCF3F7",      // teal tint light
          dark: "#003D47",       // teal tint dark
          hoverLight: "#A8EBF2",
          hoverDark: "#004F5E",
        },

        accent: {
          rose: "#F5B800",       // golden yellow
          roseSoft: "#FFF3C4",   // visible yellow tint light
          roseSoftDark: "#3D2E00", // yellow tint dark
          sand: "#E0A800",
          sandSoft: "#FFE680",
          taupe: "#C99200",
        },

        status: {
          upcoming: {
            bg: "#CCF3F7",
            bgDark: "#003D47",
            text: "#0099AA",
            textDark: "#5EECF5",
            dot: "#00AEBB",
          },

          soon: {
            bg: "#FFF3C4",
            bgDark: "#3D2E00",
            text: "#7A5800",
            textDark: "#F5B800",
            dot: "#E0A800",
          },

          overdue: {
            bg: "#fef2f2",
            bgDark: "#450a0a",
            text: "#991b1b",
            textDark: "#fca5a5",
            dot: "#ef4444",
          },

          done: {
            bg: "#f0fdf4",
            bgDark: "#052e16",
            text: "#166534",
            textDark: "#86efac",
            dot: "#22c55e",
          },
        },

        edit: {
          DEFAULT: "#00AEBB",
          hover: "#0099AA",
        },

        danger: {
          DEFAULT: "#ef4444",  // red-500
          hover: "#dc2626",    // red-600
          soft: "#fef2f2",     // red-50
          softDark: "#450a0a", // red-950
        },
      },
    },
  },

  plugins: [],
};
