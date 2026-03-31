import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A365D",
        success: "#10B981",
        warning: "#F59E0B",
        bgBase: "#F8FAFC",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 54, 93, 0.05)',
        'spatial': '0 10px 30px -5px rgba(26, 54, 93, 0.1), 0 4px 10px -2px rgba(26, 54, 93, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
