/**
 * Design tokens for worldfeel.org
 *
 * This file contains the core design values used throughout the application.
 * These tokens help maintain consistency and make it easier to update the design system.
 */

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
