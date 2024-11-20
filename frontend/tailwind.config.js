/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx}",
    "./index.html",
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
        // Direct color values
        orange: {
          500: '#ff6b00',
          600: '#e65c00',
        },
        gray: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        white: '#ffffff',
        black: '#000000',
        
        // System colors
        border: "#1f2937",
        input: "#1f2937",
        ring: "#ff6b00",
        background: "#000000",
        foreground: "#ffffff",

        primary: {
          DEFAULT: "#ff6b00",
          foreground: "#ffffff",
        },

        secondary: {
          DEFAULT: "#1f2937",
          foreground: "#ffffff",
        },

        destructive: {
          DEFAULT: "#991b1b",
          foreground: "#ffffff",
        },

        muted: {
          DEFAULT: "#1f2937",
          foreground: "#9ca3af",
        },

        accent: {
          DEFAULT: "#ff6b00",
          foreground: "#ffffff",
        },

        popover: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },

        card: {
          DEFAULT: "#1f2937",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
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
      // Add custom spacing if needed
      spacing: {
        // Add any custom spacing values you need
      },
      // Add custom font settings if needed
      fontFamily: {
        // Add any custom font families
      },
      // Add custom sizing if needed
      minHeight: {
        // Add any custom min-height values
      },
      maxHeight: {
        // Add any custom max-height values
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}