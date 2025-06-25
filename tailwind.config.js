/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FFF',
        secondary: '#8B7FFF',
        accent: '#00D4FF',
        surface: '#1A1A2E',
        background: '#0F0F23',
        success: '#00E676',
        warning: '#FFC107',
        error: '#FF5252',
        info: '#2196F3',
        glass: 'rgba(255, 255, 255, 0.1)',
        'surface-light': '#252545',
        'surface-lighter': '#2E2E4F',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(91, 79, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(91, 79, 255, 0.6)' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}