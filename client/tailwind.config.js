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
        background: '#0B132B',
        surface: '#1C2541',
        text: {
          DEFAULT: '#FFFFFF',
          muted: '#9A8C98',
        },
        primary: {
          400: '#8A2BE2', // Fallback mix
          500: '#2575FC', // Electric Cyan
          600: '#6a11cb', // Sky Blue / Purple
          700: '#4A0D94',
        },
        secondary: {
          400: '#FF8A8A',
          500: '#FF416C', // Neon Orange
          600: '#FF4B2B', // Coral Red
          700: '#CC3A22',
        },
        success: '#00E676', // Online Indicator Green
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
