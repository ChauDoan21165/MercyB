/**
 * File: mercyTheme.ts
 * Path: src/styles/mercyTheme.ts
 */

export const mercyColors = {
  brand: {
    violet: '#5E4B9C',
    lavender: '#A78BFA',
    sky: '#7DD3FC',
    mint: '#6EE7B7',
    gold: '#FDE68A',
  },

  action: {
    primary: '#14B8A6',
    primaryHover: '#0F9484',
    secondary: '#C4B5FD',
    secondaryHover: '#A78BFA',
  },

  background: {
    main: '#FAF7F2',
    soft: '#F7F3FF',
    card: '#FFFFFF',
    elevated: '#FFFDF8',
    accent: '#F0EBFF',
  },

  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    soft: '#6B7280',
    brand: '#5E4B9C',
  },

  emotion: {
    sky: '#67E8F9',
    mint: '#6EE7B7',
    peach: '#FDD4A6',
    gold: '#FDE68A',
  },

  tab: {
    journey: {
      bgFrom: '#FFF1EA',
      bgTo: '#FFF8F4',
      border: '#FFB39A',
      text: '#E76F51',
      icon: '#FF8A65',
    },
    grammar: {
      bgFrom: '#ECFDF5',
      bgTo: '#F7FFF9',
      border: '#A7F3D0',
      text: '#0F9F6E',
      icon: '#10B981',
    },
    speak: {
      bgFrom: '#EFF6FF',
      bgTo: '#F7FBFF',
      border: '#BFDBFE',
      text: '#2563EB',
      icon: '#3B82F6',
    },
    logic: {
      bgFrom: '#FAF5FF',
      bgTo: '#FFF9FF',
      border: '#E9D5FF',
      text: '#9333EA',
      icon: '#A855F7',
    },
    activeShared: {
      bgFrom: '#FFF1EA',
      bgTo: '#FFF8F4',
      border: '#FFB39A',
      text: '#E76F51',
    },
  },

  feedback: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export const mercyGradients = {
  brand:
    'linear-gradient(90deg, #A78BFA 0%, #7DD3FC 33%, #6EE7B7 66%, #FDE68A 100%)',
  warmSurface:
    'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 55%, #FFFDF8 100%)',
  logicSurface:
    'linear-gradient(135deg, #FFF8F1 0%, #FFFCFA 55%, #F7F5FF 100%)',
  premium:
    'linear-gradient(90deg, #7C3AED 0%, #D946EF 50%, #FB7185 100%)',
  action:
    'linear-gradient(90deg, #14B8A6 0%, #0F9484 100%)',
} as const;

export const mercyShadows = {
  soft: '0 8px 24px rgba(15, 23, 42, 0.06)',
  card: '0 10px 28px rgba(148, 163, 184, 0.06)',
  activeWarm: '0 10px 22px rgba(255, 138, 101, 0.14)',
  activeMint: '0 10px 22px rgba(16, 185, 129, 0.12)',
  activeBlue: '0 10px 22px rgba(59, 130, 246, 0.12)',
  activePurple: '0 10px 22px rgba(168, 85, 247, 0.12)',
  premium: '0 10px 26px rgba(168, 85, 247, 0.24)',
} as const;

export const mercyRadii = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '1.75rem',
  '3xl': '2rem',
} as const;

export const mercyTokens = {
  colors: mercyColors,
  gradients: mercyGradients,
  shadows: mercyShadows,
  radii: mercyRadii,
} as const;

export default mercyTokens;