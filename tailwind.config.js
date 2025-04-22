/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          light: "#818CF8"
        },
        secondary: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#34D399"
        },
        background: {
          DEFAULT: "#F9FAFB",
          dark: "#1F2937"
        },
        text: {
          DEFAULT: "#1F2937",
          light: "#6B7280"
        }
      },
    },
  },
  plugins: [],
};