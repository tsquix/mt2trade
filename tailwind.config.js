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
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease forwards',
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
        '.animation-delay-1200': { animationDelay: '1200ms' },
      };
      addUtilities(delays, ['responsive', 'hover']);
    },
  ],
};
