/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        fluid: 'clamp(1rem, 4vw, 11rem)',
      },
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
        revealRightSm: {
          '0%': { width: '150px', height: '150px' },
          '100%': { width: '325px', height: '325px' },
        },
        revealRightLg: {
          '0%': { width: '250px', height: '250px' },
          '100%': { width: '500px', height: '500px' },
        },
        slideUpNeg44: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideUp0: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideUp44: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { maxHeight: '0' },
          '100%': { maxHeight: '100px' }, // set max height to fit text
        },
        slideDown2: {
          '0%': { maxHeight: '300px', opacity: '100%' },
          '100%': { maxHeight: '0', opacity: '0' }, // set max height to fit text
        },
        leftSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'leftSlide-fast': {
          '0%': {
            transform: 'translateX(-75%) scale(0.2)',
            filter: 'blur(24px)',

            opacity: 0.6,
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0)',

            opacity: 1,
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease forwards',
        'fade-in-slow': 'fade-in-slow 3s ease forwards',
        'fade-out-slow': 'fade-out-slow 2s ease forwards',
        'fade-in-slow-rev': 'fade-in-slow-rev 3.5s ease forwards',
        slideUpNeg44: 'slideUpNeg44 1.5s ease-out forwards',
        slideUp0: 'slideUp0 1.5s ease-out forwards',
        slideUp44: 'slideUp44 1.5s ease-out forwards',
        slideDown: 'slideDown 3s ease forwards',
        slideDown2: 'slideDown2 1s ease forwards',
        reveal: 'reveal 1s ease-out forwards',
        revealRightSm: 'revealRightSm 1s ease-in-out 1s forwards',
        revealRightLg: 'revealRightLg 1s ease-in-out 1s forwards',
        leftSlide: 'leftSlide 2.5s ease forwards',
        'leftSlide-fast': 'leftSlide-fast 1.5s ease forwards',
        activeImgSlide: 'activeImgSlide .5s ease forwards',

        'slide-up-fade-in': 'slideUpFadeIn 0.7s ease forwards',
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
