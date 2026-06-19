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
          DEFAULT: "#0d9488", // teal-600
          hover: "#0f766e",   // teal-700
          soft: "#f0fdfa",    // teal-50
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
          accentLight: "#99f6e4", // teal-200
          accentDark: "#134e4a",  // teal-900
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
          light: "#f0fdfa",      // teal-50
          dark: "#134e4a",       // teal-900
          hoverLight: "#ccfbf1", // teal-100
          hoverDark: "#115e59",  // teal-800
        },

        accent: {
          rose: "#fbbf24",     // amber-400
          roseSoft: "#fffbeb", // amber-50
          sand: "#f59e0b",     // amber-500
          sandSoft: "#fef3c7", // amber-100
          taupe: "#d97706",    // amber-600
        },

        status: {
          upcoming: {
            bg: "#f0fdfa",
            bgDark: "#134e4a",
            text: "#0f766e",
            textDark: "#5eead4",
            dot: "#0d9488",
          },

          soon: {
            bg: "#fffbeb",
            bgDark: "#451a03",
            text: "#92400e",
            textDark: "#fcd34d",
            dot: "#f59e0b",
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
          DEFAULT: "#0d9488",
          hover: "#0f766e",
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
