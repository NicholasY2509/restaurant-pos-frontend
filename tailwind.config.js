/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        restaurant: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f8bb77',
          400: '#f59541',
          500: '#f2751a',
          600: '#e35d10',
          700: '#bc4510',
          800: '#963814',
          900: '#7a3014',
        },
        background: '#fff',
        destructive: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#3b82f6',
        foreground: '#171717',
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#f5f5f5',
          foreground: '#171717',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} 