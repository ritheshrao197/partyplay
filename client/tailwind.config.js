/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Inter', 'sans-serif'],
      },
      colors: {
        background: '#121418',
        surface: '#1C2128',
        text: '#F3F4F6',
        primary: {
          400: '#FBBF24',
          500: '#F59E0B', // Button Hover
          600: '#D97706', // Primary Accent
          700: '#B45309',
        },
        secondary: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Secondary Accent
          700: '#4338CA',
        },
        game: {
          imposter: '#ef4444',
          wordrush: '#3b82f6',
          neverhaveiever: '#8b5cf6',
          wronganswers: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
