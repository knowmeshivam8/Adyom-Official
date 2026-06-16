/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#FAF8F5",
        "text-main": "#2D2825",
        surface: "rgba(255, 255, 255, 0.9)",
        primary: {
          DEFAULT: "#8B4513",
          foreground: "#FFFFFF",
        },
        // Adyom Heritage Brand Colors
        heritage: {
          terracotta: "#C88E7D",
          terracottaLight: "#D99D8B",
          terracottaDark: "#9A6353",
          gold: "#D9A441",
          goldLight: "#E8C36A",
          goldDark: "#B8862D",
          cream: "#F4E8D8",
          creamLight: "#FAF5EE",
          creamDark: "#E8D5BE",
          brown: "#3C2415",
          brownLight: "#5C3A28",
          sand: "#C4A882",
          charcoal: "#2D2D2D",
          slate: "#4A4A4A",
          ivory: "#FFFFF0",
        },
        // Shadcn UI compatible color mapping
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ['"Outfit"', "sans-serif"],
        sans: ['"Roboto"', "sans-serif"],
        heading: ['"Outfit"', "sans-serif"],
        body: ['"Roboto"', "sans-serif"],
        accent: ['"Outfit"', "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "mandala-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "mandala-spin": "mandala-spin 20s linear infinite",
      },
      backgroundImage: {
        "heritage-gradient": "linear-gradient(135deg, #C88E7D 0%, #D99D8B 50%, #9A6353 100%)",
        "gold-gradient": "linear-gradient(135deg, #D9A441 0%, #E8C36A 50%, #B8862D 100%)",
        "cream-gradient": "linear-gradient(135deg, #F4E8D8 0%, #FAF5EE 50%, #E8D5BE 100%)",
        "hero-gradient": "linear-gradient(135deg, #C88E7D 0%, #D99D8B 40%, #D9A441 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
