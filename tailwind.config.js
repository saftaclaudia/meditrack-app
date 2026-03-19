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
          DEFAULT: "#C4A882",
          hover: "#B39470",
          soft: "#F5EFE8",
        },

        background: {
          light: "#FAF7F4",
          dark: "#1A1714",
        },

        surface: {
          light: "#FFFFFF",
          dark: "#221F1C",
          cardLight: "#FFFFFF",
          cardDark: "#221F1C",
          mutedLight: "#F5F0EB",
          mutedDark: "#2A2622",
        },

        border: {
          light: "#E8E0D8",
          dark: "#3A332C",
          subtleLight: "#F0EAE3",
          accentLight: "#E8D9C8",
          accentDark: "#4A3D30",
        },

        text: {
          primary: "#2C2420",
          darkPrimary: "#EDE8E3",

          secondary: "#7A6E66",
          darkSecondary: "#A89D94",

          muted: "#9C8878",
          darkMuted: "#7A6E66",

          icon: "#9C8878",
          iconDark: "#A89D94",

          body: "#3D3028",
          bodyDark: "#D4CCC4",
        },

        soft: {
          light: "#F5F0EB",
          dark: "#2A2622",
          hoverLight: "#EDE6DE",
          hoverDark: "#322E29",
        },

        accent: {
          rose: "#E8C4B8",
          roseSoft: "#FAF0EC",
          sand: "#D4C4B0",
          sandSoft: "#F5EFE8",
          taupe: "#C8B8A8",
        },

        status: {
          upcoming: {
            bg: "#F0EDE8",
            bgDark: "#252018",
            text: "#6B5A3E",
            textDark: "#D4C4A0",
            dot: "#C4A882",
          },

          soon: {
            bg: "#F5EDE8",
            bgDark: "#251C18",
            text: "#8B5E4A",
            textDark: "#E0B8A4",
            dot: "#C47860",
          },

          overdue: {
            bg: "#F5E8E8",
            bgDark: "#251818",
            text: "#8B4A4A",
            textDark: "#E0A4A4",
            dot: "#C46060",
          },

          done: {
            bg: "#EDF0EC",
            bgDark: "#1A201A",
            text: "#4A6B4A",
            textDark: "#A4C4A4",
            dot: "#82A882",
          },
        },

        edit: {
          DEFAULT: "#C4A882",
          hover: "#B39470",
        },

        danger: {
          DEFAULT: "#C46060",
          hover: "#A84848",
          soft: "#F5E8E8",
        },
      },
    },
  },

  plugins: [],
};
