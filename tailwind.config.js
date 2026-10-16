/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030712",
          surface: "#0B0F19",
          card: "rgba(17, 24, 39, 0.75)",
          border: "rgba(30, 41, 59, 0.8)",
          accent: "#38BDF8",
          hazard: "#FF0055",
          warning: "#F59E0B",
          emerald: "#00FF9D",
          purple: "#A855F7",
          cyan: "#00F0FF",
        }
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(255, 0, 85, 0.45)',
        'neon-emerald': '0 0 20px rgba(0, 255, 157, 0.45)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.45)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.45)',
      }
    },
  },
  plugins: [],
}