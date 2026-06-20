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
          DEFAULT: "#00AEBB", // teal vibrant
          hover: "#0099AA",   // teal darker
          soft: "#E6F9FB",    // teal tint
        },

        background: {
          light: "#f8fafc",   // slate-50
          dark: "#0f172a",    // slate-900
        },

        surface: {
          light: "#ffffff",
          dark: "#1e293b",        // slate-800
          cardLight: "#ffffff",
          cardDark: "#1e293b",
          mutedLight: "#f1f5f9",  // slate-100
          mutedDark: "#334155",   // slate-700
        },

        border: {
          light: "#e2e8f0",       // slate-200
          dark: "#334155",        // slate-700
          subtleLight: "#f1f5f9",
          accentLight: "#7FE8F0", // teal light
          accentDark: "#004D57",  // teal deep
        },

        text: {
          primary: "#0f172a",        // slate-900
          darkPrimary: "#f1f5f9",    // slate-100

          secondary: "#475569",      // slate-600
          darkSecondary: "#94a3b8",  // slate-400

          muted: "#94a3b8",          // slate-400
          darkMuted: "#64748b",      // slate-500

          icon: "#64748b",           // slate-500
          iconDark: "#94a3b8",       // slate-400

          body: "#1e293b",           // slate-800
          bodyDark: "#cbd5e1",       // slate-300
        },

        soft: {
          light: "#E6F9FB",      // teal tint
          dark: "#004D57",       // teal deep dark
          hoverLight: "#C5F2F6", // teal tint hover
          hoverDark: "#005F6B",  // teal dark hover
        },

        accent: {
          rose: "#F5B800",     // golden yellow
          roseSoft: "#FEF9E6", // golden yellow tint
          sand: "#E0A800",     // golden yellow darker
          sandSoft: "#FDF3C0", // golden yellow light
          taupe: "#C99200",    // golden yellow deep
        },

        status: {
          upcoming: {
            bg: "#E6F9FB",
            bgDark: "#004D57",
            text: "#0099AA",
            textDark: "#5EECF5",
            dot: "#00AEBB",
          },

          soon: {
            bg: "#FEF9E6",
            bgDark: "#451a03",
            text: "#92400e",
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
