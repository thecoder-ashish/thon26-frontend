const { fontFamily } = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    node: {
      global: true, // this is the key!
      // ... other node options
    },
    extend: {
      colors: {
        textColor: "hsl(var(--text-color))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mont: ['"Mont"', ...fontFamily.sans], // Added Mont
        raleway: ['"Raleway"', ...fontFamily.sans], // Added Raleway
        akira: ['"Akira"', ...fontFamily.sans], // Added Akira
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '@font-face': {
          fontFamily: 'Mont',
          fontWeight: '800',
          fontStyle: 'normal',
          fontDisplay: 'swap', 
          src: `url('/Mont.ttf') format('truetype')`, // Path to your Mont font
        },
        '@font-face': {
          fontFamily: 'Akira',
          fontDisplay: 'block', 
          src: `url('/Akira.otf') format('opentype')`, // Path to your Akira font
        },
        '@font-face': {
          fontFamily: 'Raleway',
          fontWeight: '800',
          fontStyle: 'normal',
          fontDisplay: 'swap',
          src: `url('/Raleway.ttf') format('truetype')`, // Path to your Raleway font
        }
      })
    },
    require("tailwindcss-animate"),
    require("tw-elements/dist/plugin.cjs"),
  ],
};