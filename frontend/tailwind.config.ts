import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'teal-light': '#75DDDD',
        ocean: '#508991',
        navy: '#172A3A',
        'teal-deep': '#004346',
        emerald: '#09BC8A',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        bodoni: ['var(--font-bodoni)', 'Didot', 'Georgia', 'serif'],
        'serif-kr': ['var(--font-noto-serif-kr)', 'Batang', 'serif'],
        noto: ['var(--font-noto-sc)', 'sans-serif'],
      },
      fontSize: {
        display: ['4.5rem', { lineHeight: '1.1', fontWeight: '600' }],
        h1: ['3rem', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['2.25rem', { lineHeight: '1.3', fontWeight: '500' }],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
