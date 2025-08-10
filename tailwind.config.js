/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-in-slow': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0.3 },
        },
        'fade-out-slow': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'fade-in-slow-rev': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        reveal: {
          '0%': { height: '100%' },
          '100%': { height: '0%' },
        },
        slideDown: {
          '0%': { maxHeight: '0' },
          '100%': { maxHeight: '100px' }, // set max height to fit text
        },
        leftSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease forwards',
        'fade-in-slow': 'fade-in-slow 3s ease forwards',
        'fade-out-slow': 'fade-out-slow 2s ease forwards',
        'fade-in-slow-rev': 'fade-in-slow-rev 3.5s ease forwards',
        slideDown: 'slideDown 3s ease forwards',
        reveal: 'reveal 1s ease-out forwards',
        leftSlide: 'leftSlide 2.5s ease forwards',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        mainBg: '#161616',
        brighterBg: '#2e2e2e',
        darkGreen: '#14532d',
        lightGreen: '#4ade80',
        lightGray: '#7e949d',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const delays = {
        '.animation-delay-0': { animationDelay: '0ms' },
        '.animation-delay-200': { animationDelay: '200ms' },
        '.animation-delay-400': { animationDelay: '400ms' },
        '.animation-delay-600': { animationDelay: '600ms' },
        '.animation-delay-800': { animationDelay: '800ms' },
        '.animation-delay-1600': { animationDelay: '1600ms' },
        '.animation-delay-1800': { animationDelay: '1800ms' },
        '.animation-delay-2000': { animationDelay: '2000ms' },
        '.animation-delay-2500': { animationDelay: '2500ms' },
        '.animation-delay-2800': { animationDelay: '2800ms' },
        '.animation-delay-3000': { animationDelay: '3000ms' },
        '.animation-delay-3300': { animationDelay: '3300ms' },
        '.animation-delay-3600': { animationDelay: '3600ms' },
        '.animation-delay-3900': { animationDelay: '3900ms' },
      };
      addUtilities(delays, ['responsive', 'hover']);
    },
  ],
};
