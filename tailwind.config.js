/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent:  "#AFFF4F",
        accent2: "#9FFF00",
      },
      boxShadow: {
        'glow-green': '0 0 8px #AFFF4F, 0 0 16px #9FFF00',
      },
    },
  },
  plugins: [],
}
