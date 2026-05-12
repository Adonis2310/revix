import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#050507',
          surface: '#09090F',
          elevated: '#0E0E18',
          card: '#111120',
          'card-hover': '#141428',
        },
        accent: {
          blue: '#0A5FFF',
          'blue-muted': 'rgba(10,95,255,0.12)',
          'blue-glow': 'rgba(10,95,255,0.25)',
          cyan: '#00CFFF',
          green: '#00D97E',
          'green-muted': 'rgba(0,217,126,0.12)',
          orange: '#FF6B35',
          red: '#FF3B30',
        },
        content: {
          primary: '#F2F2FA',
          secondary: '#8888A8',
          muted: '#44445A',
          dim: '#22223A',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.055)',
          subtle: 'rgba(255,255,255,0.028)',
          strong: 'rgba(255,255,255,0.10)',
          blue: 'rgba(10,95,255,0.28)',
          green: 'rgba(0,217,126,0.28)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"Fira Code"', '"Cascadia Code"', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['88px', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '200' }],
        'display-xl': ['72px', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '200' }],
        'display-lg': ['56px', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '300' }],
        'display-md': ['40px', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '300' }],
        'heading-xl': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'heading-lg': ['22px', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'heading-md': ['17px', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['15px', { lineHeight: '1.6', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-md': ['13px', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
        'label-lg': ['12px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '600' }],
        'label-md': ['11px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '600' }],
        'label-sm': ['10px', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(10,95,255,0.2), 0 0 80px rgba(10,95,255,0.08)',
        'glow-green': '0 0 40px rgba(0,217,126,0.2), 0 0 80px rgba(0,217,126,0.08)',
        'glow-subtle': '0 0 60px rgba(10,95,255,0.1)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
        'card-hover': '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to: { backgroundPosition: '200% center' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
