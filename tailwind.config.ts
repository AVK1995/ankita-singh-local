import type { Config } from 'tailwindcss';

/**
 * Bindwithyoga · 5-Day Fertility Reset Challenge.
 *
 * PALETTE · ENGLISH PASTEL LAVENDER, the project skin (see
 * design-system.project.md, which overrides the locked Warm Navy). Lilac-tinted
 * off-white is the environment, deep aubergine is the structure, heather is the
 * one accent, rose is the spark, sage is semantic (ticks and guarantees) only.
 *
 * ⚠️ THIRD of three copies of the palette. The other two are the `:root` block
 * in app/globals.css and the `C` object in app/_landing/shared.tsx. All three
 * change together: this file has silently held a stale colour before on other
 * builds, and the only way to catch it is to grep the hex before calling a
 * re-skin done.
 *
 * The keys are roles, not colour words: `ink.deep` is the colophon floor,
 * `gold.*` is the heather accent and `coral.*` is the rose spark. `gold.deep`
 * and `gold.ink` are the two steps readable on a light ground (large text and
 * small text); `gold.DEFAULT` is the on-dark value.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#FFF7F9', alt: '#FDF3F5', surface: '#FFFFFF' },
        ink: {
          DEFAULT: '#1F1014',
          soft: '#4B2A33',
          deep: '#C73A57',
          on: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#FCE4EA',
          pale: '#FDF3F5',
          wash: '#FFE8EE',
          mid: '#F87186',
          deep: '#F24C69',
          ink: '#C73A57',
          cta: '#F24C69',
        },
        /* `emerald.bed` is the same value as `C.navyBed` in shared.tsx, which
           keeps the skin's role name. Same colour, two names, on purpose. */
        emerald: { DEFAULT: '#5FA37F', ink: '#2F6B4C', bed: '#FCE7EC' },
        coral: { DEFAULT: '#FF6E88', bed: '#FCE7EC', ink: '#C73A57' },
        line: { DEFAULT: '#F2D6DD', strong: '#E5D2D8' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '999px' },
      boxShadow: {
        /* Layered and tinted toward the brand ink, never a flat grey. */
        soft: '0 4px 20px -10px rgba(31, 16, 20,0.14)',
        card: '0 18px 44px -26px rgba(31, 16, 20,0.26)',
        lift: '0 2px 0 0 rgba(248, 113, 134,0.30), 0 22px 42px -22px rgba(31, 16, 20,0.34)',
      },
    },
  },
  plugins: [],
};

export default config;
