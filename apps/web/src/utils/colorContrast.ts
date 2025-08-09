/**
 * Color contrast utilities for improved text readability
 * Apple/Google-inspired approach: maintain hue while ensuring readability
 */

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 109, g: 207, b: 246 }; // fallback
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb({ h, s, l }: HSL): RGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calculate relative luminance of a color (WCAG standard)
 */
function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG standard)
 */
function getContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if a color has sufficient contrast against a light background
 * Uses WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
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
 * Apple-style adaptive color: Ensure readability while preserving hue
 * This is the main function for improving text colors
 */
export function getReadableTextColor(
  originalColor: string,
  options: {
    backgroundColor?: string;
    isLargeText?: boolean;
    preserveVibrancy?: boolean;
    maxDarkening?: number; // 0-1, how much we're willing to darken
  } = {}
): string {
  const {
    backgroundColor = '#FFFFFF',
    isLargeText = true,
    preserveVibrancy = true,
    maxDarkening = 0.6,
  } = options;

  // If color already has good contrast, return as-is
  if (hasGoodContrast(originalColor, backgroundColor, isLargeText)) {
    return originalColor;
  }

  const rgb = hexToRgb(originalColor);
  const hsl = rgbToHsl(rgb);

  // Target contrast ratio
  const targetContrast = isLargeText ? 3.1 : 4.6; // Slightly above minimum for safety

  // Binary search for optimal lightness
  let minL = Math.max(0, hsl.l * (1 - maxDarkening)); // Don't go darker than this
  let maxL = hsl.l; // Start with original lightness
  let bestL = hsl.l;

  for (let i = 0; i < 20; i++) {
    // Max 20 iterations
    const midL = (minL + maxL) / 2;
    const testHsl = { ...hsl, l: midL };
    const testRgb = hslToRgb(testHsl);

    const contrast = getContrastRatio(testRgb, hexToRgb(backgroundColor));

    if (contrast >= targetContrast) {
      bestL = midL;
      minL = midL; // This lightness works, try going lighter
    } else {
      maxL = midL; // Need more contrast, go darker
    }

    if (maxL - minL < 1) break; // Close enough
  }

  // Apply the best lightness found
  const adjustedHsl = { ...hsl, l: bestL };

  // Optionally boost saturation slightly to maintain vibrancy when darkening significantly
  if (preserveVibrancy && bestL < hsl.l * 0.7) {
    adjustedHsl.s = Math.min(100, hsl.s * 1.1);
  }

  const adjustedRgb = hslToRgb(adjustedHsl);
  return rgbToHex(adjustedRgb);
}

/**
 * Get CSS text shadow for better contrast (Apple-style)
 * Creates a subtle shadow that helps text pop against varied backgrounds
 */
export function getTextShadowForContrast(
  textColor: string,
  intensity: 'subtle' | 'medium' | 'strong' = 'medium'
): string {
  const rgb = hexToRgb(textColor);
  const hsl = rgbToHsl(rgb);

  // Determine if text is light or dark
  const isLightText = hsl.l > 60;

  // Create shadow color opposite to text
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
 * Create a tinted background color that complements the text (Google-style)
 * Useful for creating colored background areas behind text
 */
export function getTintedBackground(
  textColor: string,
  opacity: number = 0.12
): string {
  const rgb = hexToRgb(textColor);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Utility to determine if we should use light or dark text on a colored background
 */
export function shouldUseLightText(backgroundColor: string): boolean {
  const rgb = hexToRgb(backgroundColor);
  const luminance = getLuminance(rgb);
  return luminance < 0.5;
}
