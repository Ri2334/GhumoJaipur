/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B35D38",
        secondary: "#2C1E18",
        terracotta: {
          50: "#FAF1EC",
          100: "#F5E2D8",
          200: "#EBC5B2",
          300: "#DF9D7E",
          400: "#D37B55",
          500: "#B35D38",
          600: "#964B2A",
          700: "#793A1F",
          800: "#5D2B16",
          900: "#421C0D",
        },
        sand: {
          50: "#FFFDF9",
          100: "#FAF5EF",
          200: "#F3E8DB",
          300: "#E6D6C3",
          400: "#D7C1A9",
        },
        sepia: {
          900: "#2C1E18",
          800: "#3D2B23",
          700: "#543C32",
        }
      }
    },
  },
  plugins: [],
}
