/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e8a838',
          light: '#f0b84d',
          dark: '#c88a20',
        },
        accent: '#e85d3a',
        surface: {
          DEFAULT: '#1e1b18',
          light: '#2a2520',
          dark: '#171412',
        },
        warm: {
          50: '#faf5ef',
          100: '#f5ede0',
          200: '#e8d5b8',
          300: '#d4b88a',
          400: '#c49a5c',
          500: '#b88340',
          600: '#a06a2c',
          700: '#845224',
          800: '#6b4120',
          900: '#58361c',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'char-reveal': 'charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        charReveal: {
          '0%': { opacity: '0', transform: 'translateY(100%) rotateX(-80deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#e8a838' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 168, 56, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 168, 56, 0.3)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
