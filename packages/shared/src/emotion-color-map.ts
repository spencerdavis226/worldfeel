/**
 * Emotion → Hex Color Map (TypeScript)
 *
 * Update: every canonical emotion now maps to a UNIQUE hex color.
 * Approach:
 *  - Keep curated base colors per family for semantic fit.
 *  - If two emotions collide on the same hex, we nudge hue/saturation/lightness deterministically
 *    until it becomes unique, staying near the original family color.
 *  - Canonical keys remain single-word only.
 */

/** Canonical emotion → hex color. ONE WORD KEYS ONLY. */
export const EMOTIONS = {
  // —— POSITIVE / JOY ——
  joy: '#FFEE58',
  happiness: '#FFF176',
  delight: '#FFE66D',
  glee: '#FFE066',
  mirth: '#FFE082',
  elation: '#FFD166',
  ecstasy: '#F9A825',
  euphoria: '#F9A825',
  exhilaration: '#FFA726',
  excitement: '#FFA726',
  enthusiasm: '#FB8C00',
  zest: '#FB8C00',
  zeal: '#F59E0B',
  thrill: '#FFA000',
  bliss: '#F9A825',
  rapture: '#F43F5E',
  jubilation: '#F9A825',
  triumph: '#F59E0B',
  pride: '#D4AF37',
  satisfaction: '#FBC02D',
  contentment: '#FDE68A',
  serenity: '#93C5FD',
  calm: '#A7F3D0',
  peace: '#93C5FD',
  tranquility: '#BAE6FD',
  relaxation: '#CFFAFE',
  relief: '#A7F3D0',
  comfort: '#CCFBF1',
  safety: '#A7F3D0',
  security: '#99F6E4',
  confidence: '#22C55E',
  assurance: '#10B981',
  empowerment: '#4ADE80',
  encouragement: '#6EE7B7',
  validation: '#34D399',
  acceptance: '#34D399',
  belonging: '#86EFAC',
  connectedness: '#6EE7B7',
  closeness: '#F9A8D4',
  intimacy: '#FB7185',
  harmony: '#A7F3D0',
  inspiration: '#60A5FA',
  motivation: '#F59E0B',
  optimism: '#38BDF8',
  hope: '#38BDF8',
  anticipation: '#FFB74D',
  eagerness: '#FFA726',
  interest: '#F59E0B',
  curiosity: '#F59E0B',
  wonder: '#6366F1',
  awe: '#6366F1',
  elevation: '#818CF8',
  admiration: '#A7F3D0',
  adoration: '#FCA5A5',
  love: '#F43F5E',
  affection: '#FDA4AF',
  fondness: '#FECDD3',
  tenderness: '#FDB3C6',
  warmth: '#FFB4A2',
  compassion: '#C084FC',
  empathy: '#D8B4FE',
  sympathy: '#E9D5FF',
  kindness: '#A7F3D0',
  generosity: '#6EE7B7',
  gratitude: '#2DD4BF',
  appreciation: '#34D399',
  respect: '#10B981',
  trust: '#34D399',
  esteem: '#86EFAC',
  playfulness: '#FFD166',
  amusement: '#FFE082',
  humor: '#FFD166',
  fun: '#FFC857',
  cheerfulness: '#FFF59D',
  cheer: '#FFF59D',
  lightheartedness: '#FFE082',
  fulfillment: '#FBC02D',
  radiance: '#FFD166',
  brightness: '#FFE66D',
  buoyancy: '#FFEE58',
  glow: '#FFD166',

  // —— ATTRACTION / DESIRE ——
  attraction: '#FB7185',
  desire: '#EF4444',
  lust: '#E11D48',
  longing: '#F472B6',
  yearning: '#FB7185',
  craving: '#F97316',
  passion: '#FB7185',
  infatuation: '#F472B6',
  arousal: '#EF4444',
  greed: '#4D7C0F',

  // —— SURPRISE / NOVELTY ——
  surprise: '#67E8F9',
  astonishment: '#4DD0E1',
  amazement: '#26C6DA',
  shock: '#00ACC1',
  disbelief: '#06B6D4',

  // —— CONFUSION / COGNITIVE ——
  confusion: '#C4B5FD',
  puzzlement: '#A78BFA',
  perplexity: '#A78BFA',
  bewilderment: '#C4B5FD',
  disorientation: '#A78BFA',
  uncertainty: '#A78BFA',
  doubt: '#A78BFA',
  skepticism: '#64748B',
  ambivalence: '#A78BFA',
  hesitation: '#93C5FD',
  indecision: '#93C5FD',

  // —— ANGER ——
  anger: '#E63946',
  annoyance: '#FF9999',
  irritation: '#FF7A7A',
  aggravation: '#FF5C5C',
  frustration: '#F97316',
  impatience: '#FF7A7A',
  vexation: '#FF7A7A',
  indignation: '#E76F51',
  outrage: '#D62828',
  fury: '#B91C1C',
  rage: '#B91C1C',
  wrath: '#7F1D1D',
  hatred: '#7F1D1D',
  hostility: '#991B1B',
  resentment: '#991B1B',
  bitterness: '#7C2D12',
  spite: '#9A3412',
  malice: '#7C2D12',
  vengefulness: '#7F1D1D',
  scorn: '#9F1239',
  contempt: '#9F1239',
  disdain: '#9F1239',
  ire: '#DC2626',
  pique: '#EF4444',
  umbrage: '#DC2626',

  // —— DISGUST ——
  disgust: '#6B8E23',
  revulsion: '#3F6212',
  abhorrence: '#365314',
  loathing: '#4D7C0F',
  aversion: '#65A30D',
  distaste: '#84CC16',
  repugnance: '#4D7C0F',
  nausea: '#84CC16',

  // —— FEAR / ANXIETY ——
  fear: '#00796B',
  anxiety: '#0E7490',
  worry: '#0284C7',
  dread: '#0C4A6E',
  terror: '#0B3C49',
  panic: '#0B3C49',
  horror: '#0B3C49',
  fright: '#0E7490',
  alarm: '#0891B2',
  unease: '#0EA5E9',
  nervousness: '#0891B2',
  apprehension: '#0EA5E9',
  tension: '#2563EB',
  stress: '#DC2626',
  overwhelm: '#EA580C',
  insecurity: '#0EA5E9',
  intimidation: '#0C4A6E',
  timidity: '#38BDF8',
  shyness: '#93C5FD',
  suspicion: '#155E75',
  distrust: '#0F766E',
  paranoia: '#115E59',
  wariness: '#134E4A',
  angst: '#0E7490',
  trepidation: '#0C4A6E',
  jitters: '#60A5FA',
  foreboding: '#0C4A6E',

  // —— SADNESS / LOSS ——
  sadness: '#2563EB',
  sorrow: '#1D4ED8',
  grief: '#1E3A8A',
  mourning: '#1E3A8A',
  heartache: '#1D4ED8',
  heartbreak: '#1D4ED8',
  melancholy: '#3B82F6',
  gloom: '#1F2937',
  blue: '#0D47A1',
  dejection: '#1D4ED8',
  despondency: '#1E3A8A',
  despair: '#0B3C91',
  hopelessness: '#0B3C91',
  disappointment: '#3B82F6',
  discouragement: '#3B82F6',
  loneliness: '#64748B',
  isolation: '#475569',
  alienation: '#334155',
  rejection: '#475569',
  abandonment: '#334155',
  neglect: '#334155',
  hurt: '#2563EB',
  depressed: '#143C8A',
  shame: '#7E22CE',
  guilt: '#8B3A3A',
  remorse: '#7C2D12',
  regret: '#9B6C9E',
  contrition: '#78350F',
  repentance: '#6B21A8',
  humiliation: '#581C87',
  embarrassment: '#A78BFA',
  mortification: '#6B21A8',
  awkwardness: '#C4B5FD',
  inadequacy: '#1D4ED8',
  inferiority: '#1D4ED8',
  worthlessness: '#334155',
  helplessness: '#1F2937',
  powerlessness: '#1F2937',
  vulnerability: '#93C5FD',
  misery: '#1E3A8A',

  // —— ENVY / JEALOUSY ——
  envy: '#66A80F',
  jealousy: '#3F6212',
  covetousness: '#4D7C0F',

  // —— FATIGUE / APATHY ——
  boredom: '#9CA3AF',
  apathy: '#6B7280',
  indifference: '#9CA3AF',
  listlessness: '#94A3B8',
  lethargy: '#94A3B8',
  weariness: '#94A3B8',
  numbness: '#94A3B8',
  emptiness: '#6B7280',
  complacency: '#9CA3AF',
  ennui: '#9CA3AF',
  fatigue: '#9CA3AF',
  tedium: '#9CA3AF',

  // —— MIXED / BITTERSWEET ——
  nostalgia: '#C49A6C',
  bittersweetness: '#C49A6C',
  ruefulness: '#9B6C9E',
  ambivalencemix: '#A78BFA',
  conflictedness: '#A78BFA',
  disillusionment: '#475569',
  homesickness: '#8B6E4E',

  // —— MORAL / ELEVATION / REVERENCE ——
  reverence: '#818CF8',
  elevationmoral: '#818CF8',

  // —— REGULATION / CALM NUANCES ——
  equanimity: '#93C5FD',
  composure: '#A7F3D0',
  poise: '#A7F3D0',
  centeredness: '#A7F3D0',
  stillness: '#BAE6FD',
  mindfulness: '#93C5FD',
  patience: '#A7F3D0',
  groundedness: '#99F6E4',
  resilience: '#34D399',

  // —— SOCIAL / OTHER DISTINCT ——
  camaraderie: '#86EFAC',
  fellowship: '#86EFAC',
  protectiveness: '#22C55E',
  nurturance: '#FDE68A',
  caregiving: '#FDE68A',
  schadenfreude: '#9F1239',
  compersion: '#86EFAC',
} as const;

export type EmotionKey = keyof typeof EMOTIONS;

// ————————————————————————————————————————————————————————————————
// Unique color enforcement utilities
// ————————————————————————————————————————————————————————————————

type HSL = { h: number; s: number; l: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToHsl(hex: string): HSL {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return { h: 0, s: 0, l: 50 };
  const r = parseInt(m[1]!, 16) / 255;
  const g = parseInt(m[2]!, 16) / 255;
  const b = parseInt(m[3]!, 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
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
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: HSL): string {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Deterministically nudge a base HSL to a nearby distinct shade.
 * The step grows with attempts so collisions resolve quickly while
 * staying in-family.
 */
function nudgeHsl(base: HSL, attempt: number): HSL {
  const h = base.h + 7 * attempt; // gentle hue walk
  const s = clamp(base.s + (attempt % 2 === 0 ? 6 : -5), 18, 96);
  const l = clamp(base.l + (attempt % 3 === 0 ? -4 : 3), 15, 92);
  return { h, s, l };
}

/**
 * Build a Map with globally unique colors, preserving semantic neighborhoods.
 */
function makeUniqueMap<T extends Record<string, string>>(
  src: T
): Map<keyof T, string> {
  const seen = new Set<string>();
  const out = new Map<keyof T, string>();
  const entries = Object.entries(src) as [keyof T, string][];
  for (const [k, hex] of entries) {
    let hsl = hexToHsl(hex);
    let attempt = 0;
    let candidate = hslToHex(hsl);
    while (seen.has(candidate)) {
      attempt += 1;
      hsl = nudgeHsl(hsl, attempt);
      candidate = hslToHex(hsl);
    }
    seen.add(candidate);
    out.set(k, candidate);
  }
  return out;
}

export const EmotionColorMap: Map<EmotionKey, string> = makeUniqueMap(EMOTIONS);

/** Assert uniqueness at runtime (dev safety). */
export function assertUniqueColors(): void {
  const rev = new Map<string, EmotionKey[]>();
  for (const [k, v] of EmotionColorMap.entries()) {
    const list = rev.get(v) || [];
    list.push(k);
    rev.set(v, list);
  }
  for (const [hex, list] of rev.entries()) {
    if (list.length > 1) {
      throw new Error(`Duplicate color ${hex} for: ${list.join(', ')}`);
    }
  }
}

/**
 * Aliases for common single-word variants/adjectives/misspellings.
 * (Single-word only.)
 */
export const EMOTION_ALIASES: Record<string, EmotionKey> = {
  // —— Positive
  happy: 'happiness',
  glad: 'happiness',
  joyful: 'joy',
  delighted: 'delight',
  gleeful: 'glee',
  elated: 'elation',
  ecstatic: 'ecstasy',
  euphoric: 'euphoria',
  exhilarated: 'exhilaration',
  excited: 'excitement',
  enthusiastic: 'enthusiasm',
  zestful: 'zest',
  zealous: 'zeal',
  thrilled: 'thrill',
  blissful: 'bliss',
  rapturous: 'rapture',
  jubilant: 'jubilation',
  proud: 'pride',
  gratified: 'satisfaction',
  content: 'contentment',
  serene: 'serenity',
  peaceful: 'peace',
  tranquil: 'tranquility',
  relaxed: 'relaxation',
  relieved: 'relief',
  comfortable: 'comfort',
  confident: 'confidence',
  assured: 'assurance',
  empowered: 'empowerment',
  encouraged: 'encouragement',
  validated: 'validation',
  accepted: 'acceptance',
  hopeful: 'hope',
  optimistic: 'optimism',
  grateful: 'gratitude',
  appreciative: 'appreciation',
  respectful: 'respect',
  loving: 'love',
  loved: 'love',
  affectionate: 'affection',
  fond: 'fondness',
  tender: 'tenderness',
  warm: 'warmth',
  compassionate: 'compassion',
  empathetic: 'empathy',
  sympathetic: 'sympathy',
  kind: 'kindness',
  generous: 'generosity',
  trusting: 'trust',
  admiring: 'admiration',
  adoring: 'adoration',
  inspired: 'inspiration',
  motivated: 'motivation',
  interested: 'interest',
  curious: 'curiosity',
  wonderstruck: 'wonder',
  awed: 'awe',
  elevated: 'elevation',
  playful: 'playfulness',
  amused: 'amusement',
  humorous: 'humor',
  funloving: 'playfulness',
  lighthearted: 'lightheartedness',
  fulfilled: 'fulfillment',
  buoyant: 'buoyancy',
  radiant: 'radiance',

  // —— Attraction
  attracted: 'attraction',
  desirous: 'desire',
  lustful: 'lust',
  longing: 'longing',
  yearning: 'yearning',
  craving: 'craving',
  passionate: 'passion',
  infatuated: 'infatuation',
  aroused: 'arousal',
  greedy: 'greed',

  // —— Surprise / Novelty
  surprised: 'surprise',
  astonished: 'astonishment',
  amazed: 'amazement',
  shocked: 'shock',
  disbelieving: 'disbelief',

  // —— Confusion
  confused: 'confusion',
  puzzled: 'puzzlement',
  perplexed: 'perplexity',
  bewildered: 'bewilderment',
  disoriented: 'disorientation',
  uncertain: 'uncertainty',
  doubtful: 'doubt',
  skeptical: 'skepticism',
  ambivalent: 'ambivalence',
  hesitant: 'hesitation',
  indecisive: 'indecision',

  // —— Anger
  angry: 'anger',
  mad: 'anger',
  annoyed: 'annoyance',
  irritated: 'irritation',
  aggravated: 'aggravation',
  frustrated: 'frustration',
  impatient: 'impatience',
  indignant: 'indignation',
  outraged: 'outrage', // fixed
  furious: 'fury',
  enraged: 'rage',
  wrathful: 'wrath',
  hateful: 'hatred',
  hostile: 'hostility',
  resentful: 'resentment',
  bitter: 'bitterness',
  spiteful: 'spite',
  malicious: 'malice',
  vengeful: 'vengefulness',
  scornful: 'scorn',
  contemptuous: 'contempt',
  disdainful: 'disdain',
  irate: 'ire',
  piqued: 'pique',
  umbrageous: 'umbrage',

  // —— Disgust
  disgusted: 'disgust',
  revolted: 'revulsion',
  abhorrent: 'abhorrence',
  loathsome: 'loathing',
  averse: 'aversion',
  nauseated: 'nausea',
  distasteful: 'distaste',
  repugnant: 'repugnance',

  // —— Fear / Anxiety
  afraid: 'fear',
  scared: 'fear',
  anxious: 'anxiety',
  worried: 'worry',
  dreadful: 'dread',
  terrified: 'terror',
  panicked: 'panic',
  horrified: 'horror',
  frightened: 'fright',
  alarmed: 'alarm',
  uneasy: 'unease',
  nervous: 'nervousness',
  apprehensive: 'apprehension',
  tense: 'tension',
  stressed: 'stress',
  overwhelmed: 'overwhelm',
  insecure: 'insecurity',
  intimidated: 'intimidation',
  timid: 'timidity',
  shy: 'shyness',
  suspicious: 'suspicion',
  distrustful: 'distrust',
  paranoid: 'paranoia',
  wary: 'wariness',
  angsty: 'angst',
  jittery: 'jitters',
  foreboding: 'foreboding',

  // —— Sadness / Loss
  sad: 'sadness',
  sorrowful: 'sorrow',
  grieving: 'grief',
  mourning: 'mourning',
  heartsick: 'heartache',
  heartbroken: 'heartbreak',
  melancholic: 'melancholy',
  gloomy: 'gloom',
  blueish: 'blue',
  dejected: 'dejection',
  despondent: 'despondency',
  despairing: 'despair',
  hopeless: 'hopelessness',
  disappointed: 'disappointment',
  discouraged: 'discouragement',
  lonely: 'loneliness',
  isolated: 'isolation',
  alienated: 'alienation',
  rejected: 'rejection',
  abandoned: 'abandonment',
  neglected: 'neglect',
  hurt: 'hurt',
  ashamed: 'shame',
  guilty: 'guilt',
  remorseful: 'remorse',
  regretful: 'regret',
  contrite: 'contrition',
  repentant: 'repentance',
  humiliated: 'humiliation',
  embarrassed: 'embarrassment',
  mortified: 'mortification',
  awkward: 'awkwardness',
  inadequate: 'inadequacy',
  inferior: 'inferiority',
  worthless: 'worthlessness',
  helpless: 'helplessness',
  powerless: 'powerlessness',
  vulnerable: 'vulnerability',
  miserable: 'misery',

  // —— Envy / Jealousy
  envious: 'envy',
  jealous: 'jealousy',
  covetous: 'covetousness',

  // —— Apathy / Fatigue
  bored: 'boredom',
  apathetic: 'apathy',
  indifferent: 'indifference',
  listless: 'listlessness',
  lethargic: 'lethargy',
  weary: 'weariness',
  numb: 'numbness',
  empty: 'emptiness',
  complacent: 'complacency',
  fatigued: 'fatigue',
  tired: 'fatigue',
  sleepy: 'fatigue',
  jaded: 'apathy',
  meh: 'apathy',

  // —— Mixed / Bittersweet
  nostalgic: 'nostalgia',
  bittersweet: 'bittersweetness',
  rueful: 'ruefulness',
  // ambivalent already mapped above to "ambivalence"; keep only one mapping
  conflicted: 'conflictedness',
  disillusioned: 'disillusionment',
  homesick: 'homesickness',

  // —— Regulation / Calm
  equanimous: 'equanimity',
  composed: 'composure',
  poised: 'poise',
  centered: 'centeredness',
  mindful: 'mindfulness',
  patient: 'patience',
  grounded: 'groundedness',
  resilient: 'resilience',
  chill: 'relaxation',
  fine: 'contentment',
  ok: 'contentment',
  okay: 'contentment',
  alright: 'contentment',

  // —— Social / Other
  loyal: 'respect',
  protective: 'protectiveness',
  nurturing: 'nurturance',
  caregiving: 'caregiving',
  smug: 'pride',
  sheepish: 'embarrassment',
  selfconscious: 'shyness',
  selfdoubt: 'insecurity',
  wow: 'surprise',
  yikes: 'alarm',
  ugh: 'disgust',
  gross: 'disgust',
  pumped: 'excitement',
  stoked: 'excitement',
};

/** Normalize and look up a color. */
export function getEmotionColor(input: string): string | undefined {
  if (!input) return undefined;
  // normalize: lowercase, strip non-letters (so "self-doubt" → "selfdoubt"), trim
  let key = input
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim();
  if (!key) return undefined;
  // quick typo fix: "outage" → "outrage"
  if (key === 'outage') key = 'outrage';
  // direct canonical
  if ((EmotionColorMap as Map<string, string>).has(key as EmotionKey)) {
    return (EmotionColorMap as Map<string, string>).get(key as EmotionKey);
  }
  // alias
  const alias = EMOTION_ALIASES[key];
  if (alias && EmotionColorMap.has(alias)) return EmotionColorMap.get(alias);
  // heuristic suffix stripping
  const stripped = key.replace(/(ly|ness|ful|ing|ed|ous|ive|al)$/i, '');
  const candidates = [
    stripped,
    stripped + 'e',
    stripped + 'ion',
    stripped + 'ment',
    stripped + 'ness',
  ];
  for (const c of candidates) {
    if ((EmotionColorMap as Map<string, string>).has(c as EmotionKey)) {
      return (EmotionColorMap as Map<string, string>).get(c as EmotionKey);
    }
    const a = EMOTION_ALIASES[c];
    if (a && EmotionColorMap.has(a)) return EmotionColorMap.get(a);
  }
  return undefined;
}

/** Resolve any input (canonical, alias, or simple suffix variant) to canonical EmotionKey. */
export function resolveEmotionKey(input: string): EmotionKey | undefined {
  if (!input) return undefined;
  let key = input
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim();
  if (!key) return undefined;
  if (key === 'outage') key = 'outrage';
  if ((EmotionColorMap as Map<string, string>).has(key as EmotionKey)) {
    return key as EmotionKey;
  }
  const alias = EMOTION_ALIASES[key];
  if (alias && EmotionColorMap.has(alias)) return alias;
  const stripped = key.replace(/(ly|ness|ful|ing|ed|ous|ive|al)$/i, '');
  const candidates = [
    stripped,
    stripped + 'e',
    stripped + 'ion',
    stripped + 'ment',
    stripped + 'ness',
  ];
  for (const c of candidates) {
    if ((EmotionColorMap as Map<string, string>).has(c as EmotionKey)) {
      return c as EmotionKey;
    }
    const a = EMOTION_ALIASES[c];
    if (a && EmotionColorMap.has(a)) return a;
  }
  return undefined;
}

/** All searchable terms: canonical keys + alias keys (deduped, sorted). */
export function getSearchTerms(): string[] {
  const keys = Array.from(EmotionColorMap.keys()) as string[];
  const aliases = Object.keys(EMOTION_ALIASES);
  return Array.from(new Set([...keys, ...aliases])).sort();
}
