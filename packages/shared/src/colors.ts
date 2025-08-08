import type { ColorResult } from './types.js';

// Comprehensive emotion-to-color mapping with ~150 common feeling words
export const EMOTION_COLORS: Record<string, string> = {
  // Positive emotions
  happy: '#FFD166',
  joyful: '#FFD166',
  ecstatic: '#FFC300',
  cheerful: '#FFE066',
  delighted: '#FFD700',
  elated: '#FFA500',
  excited: '#FEC84B',
  thrilled: '#FF8C42',
  euphoric: '#FF6B35',
  blissful: '#FFB84D',
  content: '#A8D8EA',
  satisfied: '#B8E6B8',
  pleased: '#C7F2C7',
  grateful: '#4CD964',
  thankful: '#52C41A',
  blessed: '#7CB342',
  appreciative: '#8BC34A',
  relieved: '#A8E6CF',
  peaceful: '#80CBC4',
  calm: '#6DCFF6',
  serene: '#87CEEB',
  tranquil: '#B0E0E6',
  relaxed: '#AFEEEE',
  centered: '#98D8C8',
  balanced: '#95D5B2',
  confident: '#3DDC97',
  empowered: '#00C896',
  strong: '#26A69A',
  proud: '#4CAF50',
  accomplished: '#66BB6A',
  successful: '#81C784',
  victorious: '#388E3C',
  hopeful: '#4CAF50',
  optimistic: '#8BC34A',
  inspired: '#7CB342',
  motivated: '#689F38',
  determined: '#558B2F',
  focused: '#00C7B7',
  energetic: '#FF9800',
  vibrant: '#FF6F00',
  alive: '#FF8F00',
  playful: '#FF5722',
  amused: '#FF7043',
  entertained: '#FF8A65',
  curious: '#03DAC6',
  intrigued: '#00BCD4',
  fascinated: '#0097A7',
  amazed: '#00ACC1',
  surprised: '#00BCD4',
  astonished: '#26C6DA',
  loved: '#FF6FAE',
  adored: '#FF77AA',
  cherished: '#FF8A95',
  cared: '#FFCDD2',
  supported: '#F8BBD9',
  valued: '#F48FB1',
  connected: '#CE93D8',
  close: '#E1BEE7',
  warm: '#FFAB91',
  cozy: '#FFCCBC',
  comfortable: '#FFF3E0',
  safe: '#F3E5F5',
  secure: '#EDE7F6',

  // Neutral/Mixed emotions
  okay: '#9E9E9E',
  fine: '#BDBDBD',
  alright: '#E0E0E0',
  normal: '#F5F5F5',
  average: '#EEEEEE',
  decent: '#E8E8E8',
  mixed: '#B39DDB',
  conflicted: '#9575CD',
  uncertain: '#7986CB',
  confused: '#64B5F6',
  puzzled: '#42A5F5',
  bewildered: '#2196F3',
  thoughtful: '#1E88E5',
  pensive: '#1976D2',
  contemplative: '#1565C0',
  reflective: '#0D47A1',
  nostalgic: '#F4A261',
  reminiscent: '#E76F51',
  wistful: '#F4A261',
  melancholic: '#6A4C93',
  bittersweet: '#9B59B6',
  neutral: '#95A5A6',
  indifferent: '#B0BEC5',
  detached: '#90A4AE',
  numb: '#78909C',
  empty: '#607D8B',
  hollow: '#546E7A',
  disconnected: '#455A64',

  // Negative emotions
  sad: '#5B6CFF',
  unhappy: '#5A67D8',
  down: '#4C51BF',
  blue: '#667EEA',
  gloomy: '#5A67D8',
  dejected: '#4C51BF',
  depressed: '#553C9A',
  melancholy: '#6B46C1',
  heartbroken: '#7C3AED',
  devastated: '#8B5CF6',
  anguished: '#A78BFA',
  grief: '#6366F1',
  mourning: '#4F46E5',
  sorrowful: '#4338CA',
  despairing: '#3730A3',
  hopeless: '#312E81',
  angry: '#FF5A5F',
  mad: '#FF4444',
  furious: '#FF1744',
  enraged: '#D50000',
  livid: '#FF0000',
  irate: '#F44336',
  annoyed: '#FF5722',
  irritated: '#FF6F00',
  frustrated: '#F66D44',
  agitated: '#FF8C42',
  upset: '#FF9800',
  bothered: '#FFA726',
  disturbed: '#FFB74D',
  anxious: '#7A5AF8',
  worried: '#8E24AA',
  nervous: '#F78DA7',
  tense: '#AB47BC',
  stressed: '#FF8C42',
  overwhelmed: '#C77DFF',
  panicked: '#BA68C8',
  scared: '#CE93D8',
  afraid: '#E1BEE7',
  terrified: '#F3E5F5',
  fearful: '#EDE7F6',
  frightened: '#D1C4E9',
  horrified: '#B39DDB',
  threatened: '#9575CD',
  insecure: '#7986CB',
  vulnerable: '#9FA8DA',
  exposed: '#C5CAE9',
  lonely: '#7F8C8D',
  isolated: '#95A5A6',
  alone: '#BDC3C7',
  abandoned: '#D5DBDB',
  rejected: '#E8EAEC',
  excluded: '#F8F9FA',
  unwanted: '#EAEDED',
  unloved: '#D6DBDF',
  forgotten: '#CCD1D1',
  ignored: '#AEB6BF',
  dismissed: '#85929E',
  tired: '#9B9B9B',
  exhausted: '#7B7B7B',
  drained: '#5B5B5B',
  weary: '#818181',
  fatigued: '#6D6D6D',
  burnt: '#8D8D8D',
  depleted: '#A1A1A1',
  sluggish: '#B5B5B5',
  lethargic: '#C9C9C9',
  bored: '#B0BEC5',
  uninterested: '#90A4AE',
  apathetic: '#78909C',
  disengaged: '#607D8B',
  restless: '#546E7A',
  impatient: '#455A64',
  fidgety: '#37474F',
  guilty: '#FF6B6B',
  ashamed: '#FF5252',
  regretful: '#F44336',
  remorseful: '#E53935',
  embarrassed: '#D32F2F',
  humiliated: '#C62828',
  mortified: '#B71C1C',
  disappointed: '#FFA726',
  let: '#FF9800',
  disillusioned: '#F57C00',
  discouraged: '#EF6C00',
  defeated: '#E65100',
  crushed: '#BF360C',
  broken: '#8D6E63',
};

// A larger bank of named colors we can sample from when we need a fallback.
// Names mostly follow common design/system naming; feel free to expand.
export const NAMED_COLORS: Array<{ name: string; hex: string }> = [
  { name: 'Blurple', hex: '#5B6CFF' },
  { name: 'Sunflower', hex: '#FFC300' },
  { name: 'Honey', hex: '#FFD166' },
  { name: 'Tangerine', hex: '#FF8C42' },
  { name: 'Apricot', hex: '#FFB84D' },
  { name: 'Coral', hex: '#FF7043' },
  { name: 'Flamingo', hex: '#FF6B6B' },
  { name: 'Rose', hex: '#F48FB1' },
  { name: 'Bubblegum', hex: '#F78DA7' },
  { name: 'Lavender', hex: '#A78BFA' },
  { name: 'Amethyst', hex: '#9B59B6' },
  { name: 'Iris', hex: '#6366F1' },
  { name: 'Sky', hex: '#87CEEB' },
  { name: 'Aqua', hex: '#00BCD4' },
  { name: 'Teal', hex: '#26A69A' },
  { name: 'Mint', hex: '#A8E6CF' },
  { name: 'Jade', hex: '#00C896' },
  { name: 'Emerald', hex: '#4CAF50' },
  { name: 'Lime', hex: '#8BC34A' },
  { name: 'Olive', hex: '#95D5B2' },
  { name: 'Sand', hex: '#FFF3E0' },
  { name: 'Mushroom', hex: '#BDBDBD' },
  { name: 'Slate', hex: '#607D8B' },
  { name: 'Graphite', hex: '#455A64' },
  { name: 'Charcoal', hex: '#37474F' },
  { name: 'Midnight', hex: '#0D47A1' },
  { name: 'Crimson', hex: '#D32F2F' },
  { name: 'Scarlet', hex: '#FF1744' },
  { name: 'Amber', hex: '#FFB74D' },
  { name: 'Saffron', hex: '#FEC84B' },
  { name: 'Copper', hex: '#BF360C' },
  { name: 'Mocha', hex: '#8D6E63' },
  { name: 'Lilac', hex: '#CE93D8' },
  { name: 'Periwinkle', hex: '#8B5CF6' },
  { name: 'Plum', hex: '#6B46C1' },
  { name: 'Cobalt', hex: '#1E88E5' },
  { name: 'Cerulean', hex: '#42A5F5' },
  { name: 'Seafoam', hex: '#80CBC4' },
  { name: 'Pistachio', hex: '#B8E6B8' },
  { name: 'Moss', hex: '#689F38' },
  { name: 'Pine', hex: '#388E3C' },
  { name: 'Steel', hex: '#9FA8DA' },
  { name: 'Fog', hex: '#E0E0E0' },
  { name: 'Snow', hex: '#F5F5F5' },
];

// hslToHex below relies on numeric HSL values; hash-to-HSL utility removed

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lDecimal - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Darken color for text contrast
function darkenColor(hex: string, amount: number = 20): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert to HSL
  const rPercent = r / 255;
  const gPercent = g / 255;
  const bPercent = b / 255;

  const max = Math.max(rPercent, gPercent, bPercent);
  const min = Math.min(rPercent, gPercent, bPercent);

  let h: number,
    s: number,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rPercent:
        h = (gPercent - bPercent) / d + (gPercent < bPercent ? 6 : 0);
        break;
      case gPercent:
        h = (bPercent - rPercent) / d + 2;
        break;
      case bPercent:
        h = (rPercent - gPercent) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  // Darken by reducing lightness
  l = Math.max(0, l - amount / 100);

  return hslToHex(h * 360, s * 100, l * 100);
}

// Main function to get color for a word
export function wordToColor(word: string): ColorResult {
  const normalizedWord = word.toLowerCase().trim();

  // Check if word exists in emotion map
  if (EMOTION_COLORS[normalizedWord]) {
    const hex = EMOTION_COLORS[normalizedWord];
    const shadeHex = darkenColor(hex);
    const name = findColorName(hex) ?? 'Custom';
    return { hex, shadeHex, name, matched: true };
  }

  // Check for plural forms
  const singularWord = normalizedWord.endsWith('s')
    ? normalizedWord.slice(0, -1)
    : normalizedWord;
  if (EMOTION_COLORS[singularWord]) {
    const hex = EMOTION_COLORS[singularWord];
    const shadeHex = darkenColor(hex);
    const name = findColorName(hex) ?? 'Custom';
    return { hex, shadeHex, name, matched: true };
  }

  // Fallback: select a pseudo-random named color from our bank using a stable hash
  const index = Math.abs(stableHash(normalizedWord)) % NAMED_COLORS.length;
  const pick = NAMED_COLORS[index]!;
  const hex = pick.hex;
  const shadeHex = darkenColor(hex);
  return { hex, shadeHex, name: pick.name, matched: false };
}

// Try to find a friendly name for a hex if it exists in our bank
function findColorName(hex: string): string | undefined {
  const normalized = hex.toUpperCase();
  const exact = NAMED_COLORS.find((c) => c.hex.toUpperCase() === normalized);
  if (exact) return exact.name;
  const nearest = nearestNamedColor(normalized);
  return nearest.name;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function nearestNamedColor(hex: string): { name: string; hex: string } {
  const target = hexToRgb(hex);
  let best = NAMED_COLORS[0]!;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const c of NAMED_COLORS) {
    const rgb = hexToRgb(c.hex);
    const dr = rgb.r - target.r;
    const dg = rgb.g - target.g;
    const db = rgb.b - target.b;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return best;
}

// Public helper to translate a hex color to our closest known color name
export function colorHexToName(hex: string): string {
  return findColorName(hex) ?? 'Custom';
}

// Small stable hash for indexing into banks without crypto cost
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Generate a palette of related colors
export function generatePalette(
  baseColor: string,
  count: number = 5
): string[] {
  const palette: string[] = [baseColor];

  // Extract HSL from base color
  const r = parseInt(baseColor.slice(1, 3), 16) / 255;
  const g = parseInt(baseColor.slice(3, 5), 16) / 255;
  const b = parseInt(baseColor.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number,
    s: number,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
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
      default:
        h = 0;
    }
    h /= 6;
  }

  // Generate related colors by varying hue and lightness
  for (let i = 1; i < count; i++) {
    const hueShift = (i * 60) % 360; // 60-degree shifts
    const newH = (h * 360 + hueShift) % 360;
    const newL = Math.max(0.2, Math.min(0.8, l + (i % 2 === 0 ? 0.1 : -0.1)));
    palette.push(hslToHex(newH, s * 100, newL * 100));
  }

  return palette;
}

// WCAG contrast ratio calculation
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const linearRgb = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return (
      0.2126 * linearRgb[0]! + 0.7152 * linearRgb[1]! + 0.0722 * linearRgb[2]!
    );
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if color meets WCAG AA contrast requirement
export function meetsContrastRequirement(
  background: string,
  text: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(background, text);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}
