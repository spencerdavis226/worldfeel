/**
 * Lightweight color contrast utilities
 *
 * Simplified version of colorContrast.ts that maintains the same API
 * but uses more efficient algorithms to reduce bundle size.
 */

/**
 * Simple hex to RGB conversion
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 109, g: 207, b: 246 }; // fallback
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Simple RGB to hex conversion
 */
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Simplified luminance calculation (good enough for contrast)
 */
function getLuminance({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): number {
  // Simplified luminance calculation
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Simple contrast ratio calculation
 */
function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if a color has sufficient contrast
 */
function hasGoodContrast(
  textColor: string,
  backgroundColor: string = '#FFFFFF',
  isLargeText: boolean = true
): boolean {
  const textRgb = hexToRgb(textColor);
  const bgRgb = hexToRgb(backgroundColor);
  const contrast = getContrastRatio(textRgb, bgRgb);
  const requiredContrast = isLargeText ? 3 : 4.5;
  return contrast >= requiredContrast;
}

/**
 * Simplified readable text color - just darken if needed
 */
export function getReadableTextColor(
  originalColor: string,
  options: {
    backgroundColor?: string;
    isLargeText?: boolean;
    preserveVibrancy?: boolean;
    maxDarkening?: number;
  } = {}
): string {
  const {
    backgroundColor = '#FFFFFF',
    isLargeText = true,
    maxDarkening = 0.6,
  } = options;

  // If color already has good contrast, return as-is
  if (hasGoodContrast(originalColor, backgroundColor, isLargeText)) {
    return originalColor;
  }

  const rgb = hexToRgb(originalColor);

  // Simple approach: darken the color until it has good contrast
  let darkenAmount = 0.3; // Start with 30% darkening
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts && darkenAmount <= maxDarkening) {
    const darkened = {
      r: Math.round(rgb.r * (1 - darkenAmount)),
      g: Math.round(rgb.g * (1 - darkenAmount)),
      b: Math.round(rgb.b * (1 - darkenAmount)),
    };

    const testColor = rgbToHex(darkened);
    if (hasGoodContrast(testColor, backgroundColor, isLargeText)) {
      return testColor;
    }

    darkenAmount += 0.1;
    attempts++;
  }

  // Fallback: return a very dark version
  return rgbToHex({
    r: Math.round(rgb.r * 0.2),
    g: Math.round(rgb.g * 0.2),
    b: Math.round(rgb.b * 0.2),
  });
}

/**
 * Simple text shadow for contrast
 */
export function getTextShadowForContrast(
  textColor: string,
  intensity: 'subtle' | 'medium' | 'strong' = 'medium'
): string {
  const rgb = hexToRgb(textColor);
  const luminance = getLuminance(rgb);

  // Determine if text is light or dark
  const isLightText = luminance > 0.6;
  const shadowColor = isLightText
    ? 'rgba(0, 0, 0, 0.25)'
    : 'rgba(255, 255, 255, 0.4)';

  switch (intensity) {
    case 'subtle':
      return `0 1px 2px ${shadowColor}`;
    case 'medium':
      return `0 1px 3px ${shadowColor}`;
    case 'strong':
      return `0 2px 4px ${shadowColor}`;
    default:
      return `0 1px 3px ${shadowColor}`;
  }
}

/**
 * Simplified hero style decision
 */
export function decideHeroStyle(
  worldHex: string,
  bgHex: string,
  options: { targetCR?: number; tone?: number } = {}
): {
  color: string;
  needsScrim: boolean;
  scrimAlpha: number;
  achievedContrast: number;
  usedStrategy: 'tone' | 'raiseTarget' | 'inkFallback';
} {
  const targetCR = options.targetCR ?? 3.0;

  const worldRgb = hexToRgb(worldHex);
  const bgRgb = hexToRgb(bgHex);

  // Simple approach: try different darkening levels
  const darkenLevels = [0.2, 0.4, 0.6, 0.8];

  for (const darken of darkenLevels) {
    const darkened = {
      r: Math.round(worldRgb.r * (1 - darken)),
      g: Math.round(worldRgb.g * (1 - darken)),
      b: Math.round(worldRgb.b * (1 - darken)),
    };

    const contrast = getContrastRatio(darkened, bgRgb);
    if (contrast >= targetCR) {
      return {
        color: rgbToHex(darkened),
        needsScrim: false,
        scrimAlpha: 0,
        achievedContrast: contrast,
        usedStrategy: 'tone',
      };
    }
  }

  // Fallback: use a dark gray
  const fallback = { r: 50, g: 50, b: 50 };
  const contrast = getContrastRatio(fallback, bgRgb);

  return {
    color: rgbToHex(fallback),
    needsScrim: true,
    scrimAlpha: 0.12,
    achievedContrast: contrast,
    usedStrategy: 'inkFallback',
  };
}
