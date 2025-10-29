/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#003D7A",
          foreground: "#FFFFFF",
          50: '#E6F0F9',
          100: '#CCE1F3',
          200: '#99C3E7',
          300: '#66A5DB',
          400: '#3387CF',
          500: '#003D7A',
          600: '#003062',
          700: '#002449',
          800: '#001831',
          900: '#000C18',
        },
        secondary: {
          DEFAULT: "#FFA500",
          foreground: "#FFFFFF",
          50: '#FFF5E6',
          100: '#FFEBCC',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#FFA500',
          600: '#CC8400',
          700: '#996300',
          800: '#664200',
          900: '#332100',
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#FFA500",
          foreground: "#FFFFFF",
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
        outfit: ['Outfit', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        // Fallback para compatibilidade
        poppins: ['Outfit', 'sans-serif'],
        inter: ['Outfit', 'sans-serif'],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
