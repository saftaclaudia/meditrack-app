/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7BC6A4",
          hover: "#64B392",
          soft: "#E6F5EE",
        },

        background: {
          light: "#FBF9F6",
          dark: "#1B201D",
        },

        surface: {
          light: "#FFFFFF",
          dark: "#232825",
          cardLight: "#FFFFFF",
          cardDark: "#262C28",
          mutedLight: "#F6F3EF",
          mutedDark: "#2C332E",
        },

        border: {
          light: "#E9E4DE",
          dark: "#3B423E",
          subtleLight: "#F1ECE6",
          accentLight: "#D8EFE4",
          accentDark: "#3F5E52",
        },

        text: {
          primary: "#2F3A33",
          darkPrimary: "#E6F1EA",

          secondary: "#7D8A83",
          darkSecondary: "#A7B7AE",

          muted: "#A1A7A2",
          darkMuted: "#7C8C83",

          icon: "#7D8A83",
          iconDark: "#A7B7AE",

          body: "#3F4A44",
          bodyDark: "#CAD7CF",
        },

        soft: {
          light: "#F0F7F3",
          dark: "#27312C",
          hoverLight: "#E7F3ED",
          hoverDark: "#2E3933",
        },

        accent: {
          pink: "#F2C6C2",
          pinkSoft: "#FAE6E4",
          lavender: "#D8D0F0",
        },

        status: {
          upcoming: {
            bg: "#EAF7F1",
            bgDark: "#1F2C26",
            text: "#4E7B66",
            textDark: "#A9D7BF",
            dot: "#7BC6A4",
          },

          soon: {
            bg: "#FFF6E9",
            bgDark: "#2B2419",
            text: "#A87333",
            textDark: "#F0C997",
            dot: "#E3A860",
          },

          overdue: {
            bg: "#FDECEC",
            bgDark: "#2B1F1F",
            text: "#C25A5A",
            textDark: "#F3B1B1",
            dot: "#D46A6A",
          },

          done: {
            bg: "#F3F8F5",
            bgDark: "#1F2622",
            text: "#6C8A77",
            textDark: "#B7D3C2",
            dot: "#9AC5AE",
          },
        },

        edit: {
          DEFAULT: "#7BC6A4",
          hover: "#64B392",
        },

        danger: {
          DEFAULT: "#D46A6A",
          hover: "#B85757",
          soft: "#FDECEC",
        },
      },
    },
  },

  plugins: [],
};
