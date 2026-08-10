/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#4A0E17",
          dark: "#2D080E",
          deep: "#3B0A11",
          light: "#661421",
        },
        wine: {
          DEFAULT: "#721121",
          dark: "#570C18",
          light: "#8C1628",
          bright: "#A51C30",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          warm: "#E5C158",
          muted: "#A38634",
          dark: "#876D22",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#EFE8DC",
          light: "#FFFFFF",
          muted: "#E5DEC9",
        },
        dark: {
          DEFAULT: "#0F0E13",
          surface: "#16141D",
          card: "#1F1C28",
          border: "#2D293B",
          muted: "#6B657B",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'wine-glow': '0 0 25px rgba(114, 17, 33, 0.35)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #A38634 100%)',
        'wine-gradient': 'linear-gradient(135deg, #721121 0%, #4A0E17 50%, #2D080E 100%)',
        'dark-gradient': 'linear-gradient(180deg, #16141D 0%, #0F0E13 100%)',
      }
    },
  },
  plugins: [],
};
