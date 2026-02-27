/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4a7c59",
          hover: "#3a6147",
          soft: "#6c8f7b",
        },

        surface: {
          light: "#faf8f4", //general background light
          dark: "#1e2320", //general background dark
          cardLight: "#ffffff", // card / form background light
          cardDark: "#222826", // card /form background dark
          mutedLight: "#f0ece4",
          mutedDark: "#252e28",
        },

        background: {
          light: "#f4f1ea",
          dark: "#181c1a",
        },

        border: {
          light: "#ddd6c8",
          dark: "#3a4040",
          subtleLight: "#e4ddd0",
          accentLight: "#c8dece",
          accentDark: "#3a5a40",
        },

        text: {
          primary: "#2c3a2e",
          darkPrimary: "#e4ede5",
          secondary: "#7a8a7c",
          darkSecondary: "#8a9a8c",
          muted: "#9a8e7e",
          darkMuted: "#6a7a6e",
          accentLight: "#3a5a3e",
          accentDark: "#a4c4a6",
          icon: "#6b7c6e",
          iconDark: "#9aaa9e",
          body: "#3a4a3c",
          bodyDark: "#c4d4c6",
        },

        soft: {
          light: "#eef4f0",
          dark: "#253028",
          hoverLight: "#e2eee8",
          hoverDark: "#2f3c35",
        },
        status: {
          upcoming: {
            bg: "#eef4f0",
            bgDark: "#1f2a24",
            text: "#3a6147",
            textDark: "#9fc5ab",
            dot: "#4a7c59",
          },
          soon: {
            bg: "#fdf6ec",
            bgDark: "#2a2318",
            text: "#8a5e20",
            textDark: "#e6c08a",
            dot: "#b07d3a",
          },
          overdue: {
            bg: "#fdf0ee",
            bgDark: "#2a1c1a",
            text: "#a93226",
            textDark: "#f0a8a2",
            dot: "#c0392b",
          },
          done: {
            bg: "#f4f7f4",
            bgDark: "#1e2521",
            text: "#5a7a5e",
            textDark: "#a9c9ad",
            dot: "#7a9e7e",
          },
        },

        edit: {
          DEFAULT: "#6c8f7b",
          hover: "#5a7a68",
        },

        danger: {
          DEFAULT: "#c0392b",
          hover: "#a93226",
          soft: "#f9eeec",
        },
      },
    },
  },

  plugins: [],
};
