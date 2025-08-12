/**
 * Lazy-loaded color contrast utilities
 *
 * This wrapper allows us to lazy-load the heavy colorContrast utilities
 * only when they're actually needed, reducing the main bundle size.
 */

// Lazy load the lightweight colorContrast module
const colorContrastModule = () => import('./colorContrastLight.js');

// Re-export the functions with lazy loading
export const getReadableTextColor = async (
  ...args: Parameters<
    typeof import('./colorContrastLight.js').getReadableTextColor
  >
) => {
  const { getReadableTextColor: fn } = await colorContrastModule();
  return fn(...args);
};

export const getTextShadowForContrast = async (
  ...args: Parameters<
    typeof import('./colorContrastLight.js').getTextShadowForContrast
  >
) => {
  const { getTextShadowForContrast: fn } = await colorContrastModule();
  return fn(...args);
};

export const decideHeroStyle = async (
  ...args: Parameters<typeof import('./colorContrastLight.js').decideHeroStyle>
) => {
  const { decideHeroStyle: fn } = await colorContrastModule();
  return fn(...args);
};

// Synchronous fallback functions for immediate use
export const getReadableTextColorSync = (
  color: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _options?: any
): string => {
  // Simple fallback that darkens the color for better contrast
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Darken by 40% for better contrast
  const darken = 0.4;
  const newR = Math.round(r * (1 - darken));
  const newG = Math.round(g * (1 - darken));
  const newB = Math.round(b * (1 - darken));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase();
};

export const getTextShadowForContrastSync = (
  _color: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _intensity: 'subtle' | 'medium' | 'strong' = 'medium'
): string => {
  // Simple fallback shadow
  return '0 1px 2px rgba(0, 0, 0, 0.25)';
};

export const decideHeroStyleSync = (
  worldHex: string,
  _bgHex: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _options: { targetCR?: number; tone?: number } = {}
): {
  color: string;
  needsScrim: boolean;
  scrimAlpha: number;
  achievedContrast: number;
  usedStrategy: 'tone' | 'raiseTarget' | 'inkFallback';
} => {
  // Simple fallback that darkens the color
  const hex = worldHex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const darken = 0.5;
  const newR = Math.round(r * (1 - darken));
  const newG = Math.round(g * (1 - darken));
  const newB = Math.round(b * (1 - darken));

  return {
    color:
      `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase(),
    needsScrim: false,
    scrimAlpha: 0,
    achievedContrast: 4.5,
    usedStrategy: 'tone',
  };
};
