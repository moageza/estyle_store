/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#3d3d3d',
          muted: '#6b6b6b',
        },
        cream: {
          DEFAULT: '#faf8f5',
          card: '#ffffff',
          dark: '#f3efe9',
        },
        sand: {
          DEFAULT: '#c8a96a',
          light: '#dcc89a',
          dark: '#a87c51',
        },
        accent: {
          DEFAULT: '#a87c51',
          hover: '#8a6540',
        },
        success: '#2f7d52',
        warning: '#c9883a',
        error: '#b44545',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cairo', 'serif'],
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(26,26,26,0.06)',
        'card-hover': '0 14px 40px rgba(26,26,26,0.14)',
        soft: '0 8px 30px rgba(26,26,26,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
