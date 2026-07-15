/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — shared across both themes
        pitch: {
          DEFAULT: '#1B8A4A',
          deep: '#106634',
          darker: '#0C4F28',
          tint: '#E7F5EC',
          tintbdr: '#CDE8D6',
        },
        gold: {
          DEFAULT: '#E8A93B',
          deep: '#B9791C',
          darker: '#96610E',
          tint: '#FDF3E1',
          tintbdr: '#F0DCAE',
          hover: '#D2941F',
        },
        glow: '#4ED08A',

        // Fan theme (light)
        fan: {
          bg: '#FBF9F4',
          surface: '#FFFFFF',
          border: '#E4E1D6',
          ink: '#14181F',
          muted: '#5B6472',
          faint: '#657185',
          skeleton: '#F0EEE6',
        },

        // Ops theme (dark)
        ops: {
          bg: '#0A0F1A',
          bg2: '#0C1526',
          surface: '#101B2E',
          surface2: '#12233C',
          border: 'rgba(120,150,190,0.16)',
          ink: '#FFFFFF',
          body: '#E7ECF5',
          muted: '#B7C2D6',
          faint: '#8A97AD',
        },

        // Semantic severity (BOTH themes)
        danger: { DEFAULT: '#FF6B5E', fan: '#B0241A', hover: '#E5564A' },
        warn: '#E8A93B',
        ok: '#4ED08A',
        info: '#2A5CC4',

        // Organizer role accent on cards (DESIGN.md §4: pitch / gold / #4A5A80)
        steel: '#4A5A80',
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      // Type tokens are rem (px ÷ 16) so the Accessibility module's text-size
      // control can scale ALL app text by setting the root font-size —
      // px-based tokens would ignore it. Spacing stays px: layout should not
      // grow with the text scale.
      fontSize: {
        display: ['2.875rem', { lineHeight: '1.04' }],
        h1: ['1.875rem', { lineHeight: '1.05' }],
        h2: ['1.25rem', { lineHeight: '1.2' }],
        h3: ['1.0625rem', { lineHeight: '1.25' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.84375rem', { lineHeight: '1.5' }],
        label: ['0.75rem', { lineHeight: '1.4' }],
        'mono-stat': ['1.75rem', { lineHeight: '1' }],
        'mono-tag': ['0.75rem', { lineHeight: '1', letterSpacing: '0.12em' }],
      },
      spacing: {
        card: '24px',
        section: '30px',
        gutter: '18px',
        page: '40px',
      },
      borderRadius: {
        sm: '7px',
        md: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        pill: '100px',
      },
      // DESIGN.md §5: decorative animation uses transform/opacity only, and every
      // animated element also carries motion-reduce:animate-none.
      keyframes: {
        floatBall: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(12deg)' },
        },
        msgIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        typingBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.9' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'float-ball': 'floatBall 6s ease-in-out infinite',
        'msg-in': 'msgIn 0.35s ease-out',
        'typing-bounce': 'typingBounce 1.1s ease-in-out infinite',
        blink: 'blink 1.6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.2s ease-out infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,24,31,0.04)',
        raised: '0 12px 30px rgba(16,102,52,0.28)',
        float: '0 18px 40px rgba(0,0,0,0.32)',
        hero: '0 24px 60px rgba(0,0,0,0.45)',
        toast: '0 8px 24px rgba(20,24,31,0.2)',
        inputfocus: '0 0 0 3px rgba(16,102,52,0.15)',
      },
    },
  },
  plugins: [],
};
