import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#FAF8F5',
        ink: '#2A2A2A',
        muted: '#7A7A7A',
        accent: '#7A8B7E',
        line: '#2A2A2A',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-gowun)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      boxShadow: { soft: '0 20px 60px rgba(42,42,42,0.08)' },
    },
  },
  plugins: [],
};
export default config;
