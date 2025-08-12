/**
 * Design tokens for worldfeel.org
 * 
 * This file contains the core design values used throughout the application.
 * These tokens help maintain consistency and make it easier to update the design system.
 */

// Spacing tokens (in rem)
export const spacing = {
  // Base spacing units
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
  '5xl': '3rem',    // 48px
  '6xl': '4rem',    // 64px
  
  // Custom spacing values used in the app
  '18': '4.5rem',   // 72px - used in Tailwind config
  '88': '22rem',    // 352px - used in Tailwind config
  '128': '32rem',   // 512px - used in Tailwind config
} as const;

// Border radius tokens
export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2rem',    // 32px - used in Tailwind config
  '5xl': '3rem',    // 48px - used in Tailwind config
} as const;

// Z-index tokens
export const zIndex = {
  dropdown: 20,     // Used for dropdown menus
  modal: 50,        // For future modal components
  overlay: 100,     // For overlays
} as const;

// Glass effect tokens
export const glass = {
  // Background opacity values
  bgLight: 'rgba(255, 255, 255, 0.1)',
  bgMedium: 'rgba(255, 255, 255, 0.2)',
  bgHeavy: 'rgba(255, 255, 255, 0.3)',
  bgPanel: 'rgba(255, 255, 255, 0.28)',
  
  // Border opacity values
  borderLight: 'rgba(255, 255, 255, 0.3)',
  borderMedium: 'rgba(255, 255, 255, 0.4)',
  borderHeavy: 'rgba(255, 255, 255, 0.6)',
  
  // Backdrop blur values
  blurSm: 'blur(4px)',
  blurMd: 'blur(12px)',
  blurLg: 'blur(16px)',
  blurXl: 'blur(24px)',
} as const;

// Animation duration tokens
export const animation = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '800ms',
} as const;

// Shadow tokens
export const shadows = {
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glassLg: '0 15px 35px 0 rgba(31, 38, 135, 0.4)',
  innerHighlight: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
} as const;

// Typography tokens
export const typography = {
  // Font sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  
  // Line heights
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

// Breakpoint tokens (matching Tailwind defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
