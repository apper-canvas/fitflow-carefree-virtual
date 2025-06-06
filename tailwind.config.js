/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8F66',
          dark: '#E55528'
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#7ED7D1',
          dark: '#3BA69F'
        },
        accent: '#FFE66D',
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'neu-light': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-dark': '8px 8px 16px #0a0e1a, -8px -8px 16px #1a202c'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'timer-pulse': 'timer-pulse 1s ease-in-out infinite',
        'countdown': 'countdown 1s linear infinite',
        'progress-ring': 'progress-ring 0.3s ease-out'
      },
      keyframes: {
        'timer-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' }
        },
        'countdown': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'progress-ring': {
          '0%': { stroke-dashoffset: '0' },
          '100%': { stroke-dashoffset: 'var(--dash-offset)' }
        }
      }
    },
  },
  plugins: [],
}