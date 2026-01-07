import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A9BB',
          50: '#E5F7F9',
          100: '#CCEFF3',
          200: '#99DFE7',
          300: '#66CFDB',
          400: '#33BFCF',
          500: '#00A9BB',
          600: '#008796',
          700: '#006571',
          800: '#00444C',
          900: '#002227',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
