/**
 * Emotion → Hex Color Map (TypeScript)
 *
 * Update: canonical keys are refined to read naturally with the prompt
 * "How are you feeling today?" (e.g., happy, anxious, relieved, proud).
 * - Single-word keys only.
 * - Every canonical emotion maps to a unique hex (nudged near its family color).
 */

/** Canonical emotion → hex color. ONE WORD KEYS ONLY. */
export const EMOTIONS = {
  // —— POSITIVE / JOY ——
  joyful: '#FFEE58',
  happy: '#FFF176',
  delighted: '#FFE66D',
  gleeful: '#FFE066',
  mirthful: '#FFE082',
  elated: '#FFD166',
  ecstatic: '#F9A825',
  euphoric: '#F9A825',
  exhilarated: '#FFA726',
  excited: '#FFA726',
  enthusiastic: '#FB8C00',
  zestful: '#FB8C00',
  zealous: '#F59E0B',
  thrilled: '#FFA000',
  blissful: '#F9A825',
  rapturous: '#F43F5E',
  jubilant: '#F9A825',
  triumphant: '#F59E0B',
  proud: '#D4AF37',
  satisfied: '#FBC02D',
  content: '#FDE68A',
  serene: '#93C5FD',
  calm: '#A7F3D0',
  peaceful: '#93C5FD',
  tranquil: '#BAE6FD',
  relaxed: '#CFFAFE',
  relieved: '#A7F3D0',
  comfortable: '#CCFBF1',
  safe: '#A7F3D0',
  secure: '#99F6E4',
  confident: '#22C55E',
  assured: '#10B981',
  empowered: '#4ADE80',
  encouraged: '#6EE7B7',
  validated: '#34D399',
  accepted: '#34D399',
  included: '#86EFAC',
  connected: '#6EE7B7',
  close: '#F9A8D4',
  intimate: '#FB7185',
  harmonious: '#A7F3D0',
  inspired: '#60A5FA',
  motivated: '#F59E0B',
  optimistic: '#38BDF8',
  hopeful: '#38BDF8',
  eager: '#FFB74D',
  interested: '#F59E0B',
  curious: '#F59E0B',
  wonderstruck: '#6366F1',
  awed: '#6366F1',
  uplifted: '#818CF8',
  admiring: '#A7F3D0',
  adoring: '#FCA5A5',
  loving: '#F43F5E',
  affectionate: '#FDA4AF',
  fond: '#FECDD3',
  tender: '#FDB3C6',
  warm: '#FFB4A2',
  compassionate: '#C084FC',
  empathetic: '#D8B4FE',
  sympathetic: '#E9D5FF',
  kind: '#A7F3D0',
  generous: '#6EE7B7',
  grateful: '#2DD4BF',
  appreciative: '#34D399',
  respectful: '#10B981',
  trusting: '#34D399',
  respected: '#86EFAC',
  playful: '#FFD166',
  amused: '#FFE082',
  humorous: '#FFD166',
  cheerful: '#FFF59D',
  lighthearted: '#FFE082',
  fulfilled: '#FBC02D',
  radiant: '#FFD166',
  bright: '#FFE66D',
  buoyant: '#FFEE58',
  glowing: '#FFD166',

  // —— ATTRACTION / DESIRE ——
  attracted: '#FB7185',
  desirous: '#EF4444',
  lustful: '#E11D48',
  longing: '#F472B6',
  yearning: '#FB7185',
  craving: '#F97316',
  passionate: '#FB7185',
  infatuated: '#F472B6',
  aroused: '#EF4444',
  greedy: '#4D7C0F',

  // —— SURPRISE / NOVELTY ——
  surprised: '#67E8F9',
  astonished: '#4DD0E1',
  amazed: '#26C6DA',
  shocked: '#00ACC1',
  disbelieving: '#06B6D4',

  // —— CONFUSION / COGNITIVE ——
  confused: '#C4B5FD',
  puzzled: '#A78BFA',
  perplexed: '#A78BFA',
  bewildered: '#C4B5FD',
  disoriented: '#A78BFA',
  uncertain: '#A78BFA',
  doubtful: '#A78BFA',
  skeptical: '#64748B',
  ambivalent: '#A78BFA',
  hesitant: '#93C5FD',
  indecisive: '#93C5FD',

  // —— ANGER ——
  angry: '#E63946',
  annoyed: '#FF9999',
  irritated: '#FF7A7A',
  aggravated: '#FF5C5C',
  frustrated: '#F97316',
  impatient: '#FF7A7A',
  vexed: '#FF7A7A',
  indignant: '#E76F51',
  outraged: '#D62828',
  furious: '#B91C1C',
  enraged: '#B91C1C',
  wrathful: '#7F1D1D',
  hateful: '#7F1D1D',
  hostile: '#991B1B',
  resentful: '#991B1B',
  bitter: '#7C2D12',
  spiteful: '#9A3412',
  malicious: '#7C2D12',
  vengeful: '#7F1D1D',
  scornful: '#9F1239',
  contemptuous: '#9F1239',
  disdainful: '#9F1239',
  irate: '#DC2626',
  piqued: '#EF4444',
  umbrageous: '#DC2626',

  // —— DISGUST ——
  disgusted: '#6B8E23',
  revolted: '#3F6212',
  abhorrent: '#365314',
  loathsome: '#4D7C0F',
  averse: '#65A30D',
  distasteful: '#84CC16',
  repulsed: '#4D7C0F',
  nauseated: '#84CC16',

  // —— FEAR / ANXIETY ——
  afraid: '#00796B',
  anxious: '#0E7490',
  worried: '#0284C7',
  dreading: '#0C4A6E',
  terrified: '#0B3C49',
  panicked: '#0B3C49',
  horrified: '#0B3C49',
  frightened: '#0E7490',
  alarmed: '#0891B2',
  uneasy: '#0EA5E9',
  nervous: '#0891B2',
  apprehensive: '#0EA5E9',
  tense: '#2563EB',
  stressed: '#DC2626',
  overwhelmed: '#EA580C',
  insecure: '#0EA5E9',
  intimidated: '#0C4A6E',
  timid: '#38BDF8',
  shy: '#93C5FD',
  suspicious: '#155E75',
  distrustful: '#0F766E',
  paranoid: '#115E59',
  wary: '#134E4A',
  angsty: '#0E7490',
  trepidatious: '#0C4A6E',
  jittery: '#60A5FA',
  foreboding: '#0C4A6E',

  // —— SADNESS / LOSS ——
  sad: '#2563EB',
  sorrowful: '#1D4ED8',
  grieving: '#1E3A8A',
  bereaved: '#1E3A8A',
  heartsick: '#1D4ED8',
  heartbroken: '#1D4ED8',
  melancholic: '#3B82F6',
  gloomy: '#1F2937',
  blue: '#0D47A1',
  dejected: '#1D4ED8',
  despondent: '#1E3A8A',
  despairing: '#0B3C91',
  hopeless: '#0B3C91',
  disappointed: '#3B82F6',
  discouraged: '#3B82F6',
  lonely: '#64748B',
  isolated: '#475569',
  alienated: '#334155',
  rejected: '#475569',
  abandoned: '#334155',
  neglected: '#334155',
  hurt: '#2563EB',
  depressed: '#143C8A',
  ashamed: '#7E22CE',
  guilty: '#8B3A3A',
  remorseful: '#7C2D12',
  regretful: '#9B6C9E',
  contrite: '#78350F',
  repentant: '#6B21A8',
  humiliated: '#581C87',
  embarrassed: '#A78BFA',
  mortified: '#6B21A8',
  awkward: '#C4B5FD',
  inadequate: '#1D4ED8',
  inferior: '#1D4ED8',
  worthless: '#334155',
  helpless: '#1F2937',
  powerless: '#1F2937',
  vulnerable: '#93C5FD',
  miserable: '#1E3A8A',

  // —— ENVY / JEALOUSY ——
  envious: '#66A80F',
  jealous: '#3F6212',
  covetous: '#4D7C0F',

  // —— FATIGUE / APATHY ——
  bored: '#9CA3AF',
  apathetic: '#6B7280',
  indifferent: '#9CA3AF',
  listless: '#94A3B8',
  lethargic: '#94A3B8',
  weary: '#94A3B8',
  numb: '#94A3B8',
  empty: '#6B7280',
  complacent: '#9CA3AF',
  jaded: '#9CA3AF',
  fatigued: '#9CA3AF',

  // —— MIXED / BITTERSWEET ——
  nostalgic: '#C49A6C',
  bittersweet: '#C49A6C',
  rueful: '#9B6C9E',
  conflicted: '#A78BFA',
  disillusioned: '#475569',
  homesick: '#8B6E4E',

  // —— MORAL / ELEVATION / REVERENCE ——
  reverent: '#818CF8',
  // uplifted defined above under Positive / Joy

  // —— REGULATION / CALM NUANCES ——
  equanimous: '#93C5FD',
  composed: '#A7F3D0',
  poised: '#A7F3D0',
  centered: '#A7F3D0',
  still: '#BAE6FD',
  mindful: '#93C5FD',
  patient: '#A7F3D0',
  grounded: '#99F6E4',
  resilient: '#34D399',
  silent: '#9CA3AF',

  // —— SOCIAL / OTHER DISTINCT ——
  bonded: '#86EFAC',
  protective: '#22C55E',
  nurturing: '#FDE68A',
  caring: '#FDE68A',
  schadenfreude: '#9F1239',
  compersion: '#86EFAC',

  // —— PHYSICAL / ENERGY STATES ——
  energetic: '#FF6B35',
  refreshed: '#4FC3F7',
  alert: '#29B6F6',
  focused: '#2196F3',
  cozy: '#03A9F4',
  cold: '#039BE5',
  hungry: '#FF9800',
  full: '#4CAF50',
  weak: '#9E9E9E',
  tired: '#9CA3AF',
  sore: '#FF9999',
  sick: '#8BC34A',
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
 * Aliases for common single-word variants/slang/nouns to canonical adjective keys.
 * (Single-word only.)
 */
export const EMOTION_ALIASES: Record<string, EmotionKey> = {
  // —— Positive / Joy ——
  joy: 'joyful',
  happiness: 'happy',
  delight: 'delighted',
  glee: 'gleeful',
  mirth: 'mirthful',
  elation: 'elated',
  ecstasy: 'ecstatic',
  euphoria: 'euphoric',
  exhilaration: 'exhilarated',
  excitement: 'excited',
  enthusiasm: 'enthusiastic',
  zest: 'zestful',
  zeal: 'zealous',
  thrill: 'thrilled',
  bliss: 'blissful',
  rapture: 'rapturous',
  jubilation: 'jubilant',
  triumph: 'triumphant',
  satisfaction: 'satisfied',
  contentment: 'content',
  serenity: 'serene',
  peace: 'peaceful',
  tranquility: 'tranquil',
  relaxation: 'relaxed',
  relief: 'relieved',
  comfort: 'comfortable',
  safety: 'safe',
  security: 'secure',
  confidence: 'confident',
  assurance: 'assured',
  empowerment: 'empowered',
  encouragement: 'encouraged',
  validation: 'validated',
  acceptance: 'accepted',
  belonging: 'included',
  connectedness: 'connected',
  closeness: 'close',
  intimacy: 'intimate',
  harmony: 'harmonious',
  inspiration: 'inspired',
  motivation: 'motivated',
  optimism: 'optimistic',
  hope: 'hopeful',
  anticipation: 'eager',
  eagerness: 'eager',
  interest: 'interested',
  curiosity: 'curious',
  wonder: 'wonderstruck',
  awe: 'awed',
  elevation: 'uplifted',
  admiration: 'admiring',
  adoration: 'adoring',
  love: 'loving',
  affection: 'affectionate',
  fondness: 'fond',
  tenderness: 'tender',
  warmth: 'warm',
  compassion: 'compassionate',
  empathy: 'empathetic',
  sympathy: 'sympathetic',
  kindness: 'kind',
  generosity: 'generous',
  gratitude: 'grateful',
  appreciation: 'appreciative',
  respect: 'respectful',
  trust: 'trusting',
  esteem: 'respected',
  esteemhigh: 'confident',
  fun: 'playful',
  funny: 'humorous',
  cheery: 'cheerful',
  chipper: 'cheerful',
  chirpy: 'cheerful',
  perky: 'cheerful',
  sunny: 'cheerful',
  lightheartedness: 'lighthearted',
  fulfillment: 'fulfilled',
  radiance: 'radiant',
  brightness: 'bright',
  buoyancy: 'buoyant',
  glow: 'glowing',

  // —— Attraction / Desire ——
  attraction: 'attracted',
  desire: 'desirous',
  lust: 'lustful',
  yearning: 'yearning',
  craving: 'craving',
  passion: 'passionate',
  infatuation: 'infatuated',
  arousal: 'aroused',
  horny: 'lustful',
  thirsty: 'lustful',
  smitten: 'infatuated',
  crush: 'infatuated',

  // —— Surprise / Novelty ——
  surprise: 'surprised',
  astonishment: 'astonished',
  amazement: 'amazed',
  shock: 'shocked',
  disbelief: 'disbelieving',
  stunned: 'shocked',
  speechless: 'astonished',
  mindblown: 'shocked',

  // —— Confusion / Cognitive ——
  confusion: 'confused',
  puzzlement: 'puzzled',
  perplexity: 'perplexed',
  bewilderment: 'bewildered',
  disorientation: 'disoriented',
  uncertainty: 'uncertain',
  doubt: 'doubtful',
  skepticism: 'skeptical',
  ambivalence: 'ambivalent',
  hesitation: 'hesitant',
  indecision: 'indecisive',
  unsure: 'uncertain',
  lost: 'confused',
  confounded: 'confused',
  atsea: 'confused',
  mixedup: 'confused',

  // —— Anger ——
  anger: 'angry',
  mad: 'angry',
  annoyance: 'annoyed',
  irritation: 'irritated',
  aggravation: 'aggravated',
  frustration: 'frustrated',
  impatience: 'impatient',
  vexation: 'vexed',
  indignation: 'indignant',
  outrage: 'outraged',
  fury: 'furious',
  rage: 'enraged',
  wrath: 'wrathful',
  hatred: 'hateful',
  hostility: 'hostile',
  resentment: 'resentful',
  bitterness: 'bitter',
  spite: 'spiteful',
  malice: 'malicious',
  vengefulness: 'vengeful',
  scorn: 'scornful',
  contempt: 'contemptuous',
  disdain: 'disdainful',
  ire: 'irate',
  pique: 'piqued',
  umbrage: 'umbrageous',
  pissed: 'angry',
  pissedoff: 'angry',
  irked: 'irritated',
  miffed: 'annoyed',
  sore: 'annoyed',
  heated: 'angry',
  livid: 'furious',
  seething: 'furious',
  fuming: 'furious',
  incensed: 'outraged',
  cross: 'annoyed',
  cranky: 'irritated',
  irritable: 'irritated',

  // —— Disgust ——
  disgust: 'disgusted',
  revulsion: 'revolted',
  abhorrence: 'abhorrent',
  loathing: 'disgusted',
  aversion: 'averse',
  distaste: 'distasteful',
  repugnance: 'repulsed',
  nausea: 'nauseated',
  gross: 'disgusted',
  icky: 'disgusted',
  yuck: 'disgusted',
  queasy: 'nauseated',
  sick: 'nauseated',
  sickened: 'nauseated',
  grossedout: 'disgusted',

  // —— Fear / Anxiety ——
  fear: 'afraid',
  anxiety: 'anxious',
  worry: 'worried',
  dread: 'dreading',
  terror: 'terrified',
  panic: 'panicked',
  horror: 'horrified',
  fright: 'frightened',
  alarm: 'alarmed',
  unease: 'uneasy',
  nervousness: 'nervous',
  apprehension: 'apprehensive',
  tension: 'tense',
  stress: 'stressed',
  overwhelm: 'overwhelmed',
  insecurity: 'insecure',
  intimidation: 'intimidated',
  timidity: 'timid',
  shyness: 'shy',
  suspicion: 'suspicious',
  distrust: 'distrustful',
  paranoia: 'paranoid',
  wariness: 'wary',
  angst: 'angsty',
  trepidation: 'trepidatious',
  jitters: 'jittery',
  scared: 'afraid',
  spooked: 'afraid',
  concerned: 'worried',
  onedge: 'jittery',
  nervy: 'nervous',

  // —— Sadness / Loss ——
  sadness: 'sad',
  sorrow: 'sorrowful',
  grief: 'grieving',
  mourning: 'bereaved',
  heartache: 'heartsick',
  heartbreak: 'heartbroken',
  melancholy: 'melancholic',
  gloom: 'gloomy',
  dejection: 'dejected',
  despondency: 'despondent',
  despair: 'despairing',
  hopelessness: 'hopeless',
  disappointment: 'disappointed',
  discouragement: 'discouraged',
  loneliness: 'lonely',
  isolation: 'isolated',
  alienation: 'alienated',
  rejection: 'rejected',
  abandonment: 'abandoned',
  neglect: 'neglected',
  ashamed: 'ashamed',
  guilt: 'guilty',
  remorse: 'remorseful',
  regret: 'regretful',
  contrition: 'contrite',
  repentance: 'repentant',
  humiliation: 'humiliated',
  embarrassment: 'embarrassed',
  mortification: 'mortified',
  awkwardness: 'awkward',
  inadequacy: 'inadequate',
  inferiority: 'inferior',
  worthlessness: 'worthless',
  helplessness: 'helpless',
  powerlessness: 'powerless',
  vulnerability: 'vulnerable',
  misery: 'miserable',
  down: 'sad',
  downcast: 'sad',
  bummed: 'disappointed',
  sullen: 'gloomy',
  mournful: 'bereaved',
  tearful: 'sad',

  // —— Envy / Jealousy ——
  envy: 'envious',
  jealousy: 'jealous',
  covetousness: 'covetous',
  green: 'envious',

  // —— Apathy / Fatigue ——
  boredom: 'bored',
  apathy: 'apathetic',
  indifference: 'indifferent',
  listlessness: 'listless',
  lethargy: 'lethargic',
  weariness: 'weary',
  numbness: 'numb',
  emptiness: 'empty',
  complacency: 'complacent',
  ennui: 'jaded',
  fatigue: 'fatigued',
  tired: 'fatigued',
  sleepy: 'fatigued',
  exhausted: 'fatigued',
  wiped: 'fatigued',
  burntout: 'fatigued',
  burnedout: 'fatigued',
  drained: 'fatigued',
  spent: 'fatigued',
  meh: 'apathetic',
  blah: 'apathetic',
  restless: 'anxious',

  // —— Mixed / Bittersweet ——
  nostalgic: 'nostalgic',
  bittersweetness: 'bittersweet',
  bittersweet: 'bittersweet',
  ruefulness: 'rueful',
  ambivalencemix: 'ambivalent',
  conflictedness: 'conflicted',
  disillusionment: 'disillusioned',
  homesickness: 'homesick',
  torn: 'conflicted',
  mixed: 'ambivalent',
  unsureagain: 'uncertain',

  // —— Regulation / Calm ——
  equanimity: 'equanimous',
  composure: 'composed',
  poise: 'poised',
  centeredness: 'centered',
  stillness: 'still',
  mindfulness: 'mindful',
  patience: 'patient',
  groundedness: 'grounded',
  resilience: 'resilient',
  zen: 'calm',
  balanced: 'centered',
  collected: 'composed',
  chill: 'relaxed',
  fine: 'content',
  ok: 'content',
  okay: 'content',
  alright: 'content',
  good: 'content',

  // —— Social / Other ——
  camaraderie: 'bonded',
  fellowship: 'bonded',
  loyal: 'respectful',
  protective: 'protective',
  nurturance: 'nurturing',
  caregiving: 'caring',
  smug: 'proud',
  sheepish: 'embarrassed',
  selfconscious: 'shy',
  selfdoubt: 'insecure',
  wow: 'surprised',
  yikes: 'alarmed',
  ugh: 'disgusted',
  pumped: 'excited',
  stoked: 'excited',
  amped: 'excited',

  // —— Physical / Energy States ——
  // Energy-related aliases
  energy: 'energetic',
  energized: 'energetic',
  lively: 'energetic',
  vibrant: 'energetic',
  dynamic: 'energetic',
  active: 'energetic',
  peppy: 'energetic',
  spirited: 'energetic',
  bouncy: 'energetic',
  zippy: 'energetic',
  spry: 'energetic',
  vigorous: 'energetic',
  robust: 'energetic',
  hearty: 'energetic',
  strong: 'energetic',
  powerful: 'energetic',
  invigorated: 'energetic',
  fired: 'energetic',
  hyped: 'energetic',
  wired: 'energetic',
  buzzed: 'energetic',

  // Rejuvenation aliases
  refreshment: 'refreshed',
  revitalized: 'refreshed',
  rejuvenated: 'refreshed',
  recharged: 'refreshed',
  renewed: 'refreshed',
  restored: 'refreshed',

  // Mental alertness aliases
  alertness: 'alert',
  awake: 'alert',
  conscious: 'alert',
  wakefulness: 'alert',
  consciousness: 'alert',

  // Mental focus aliases
  focus: 'focused',
  sharp: 'focused',
  clear: 'focused',
  lucid: 'focused',
  attentive: 'focused',
  concentrated: 'focused',
  present: 'focused',
  sharpness: 'focused',
  clarity: 'focused',
  lucidity: 'focused',
  attention: 'focused',
  concentration: 'focused',
  presence: 'focused',

  // Physical comfort aliases
  coziness: 'cozy',
  snug: 'cozy',
  snugness: 'cozy',

  // Temperature aliases
  heat: 'warm',
  hot: 'warm',
  burning: 'warm',
  feverish: 'warm',
  flushed: 'warm',
  sweaty: 'warm',
  clammy: 'warm',
  sticky: 'warm',
  toasty: 'warm',
  toastiness: 'warm',
  hotness: 'warm',
  burn: 'warm',
  fever: 'warm',
  flush: 'warm',
  sweat: 'warm',
  clamminess: 'warm',
  stickiness: 'warm',

  // Cold temperature aliases
  chilly: 'cold',
  freezing: 'cold',
  icy: 'cold',
  frosty: 'cold',
  frozen: 'cold',
  shivering: 'cold',
  trembling: 'cold',
  shaking: 'cold',
  quivering: 'cold',

  // Hunger aliases
  famished: 'hungry',
  ravenous: 'hungry',
  starved: 'hungry',
  famine: 'hungry',
  ravenousness: 'hungry',
  starvation: 'hungry',

  // Fullness aliases
  stuffed: 'full',
  stuff: 'full',
  satisfied: 'full',

  // Weakness aliases
  weakness: 'weak',
  feeble: 'weak',
  frail: 'weak',
  fragile: 'weak',
  feebleness: 'weak',
  frailty: 'weak',
  fragility: 'weak',

  // Fatigue aliases
  weary: 'tired',
  fatigued: 'tired',
  worn: 'tired',
  beat: 'tired',
  bushed: 'tired',
  pooped: 'tired',
  knackered: 'tired',
  groggy: 'tired',
  sluggish: 'tired',
  slow: 'tired',
  heavy: 'tired',
  weighed: 'tired',
  burdened: 'tired',
  loaded: 'tired',
  pressured: 'tired',
  beaten: 'tired',
  bush: 'tired',
  poop: 'tired',
  knackeredness: 'tired',
  grogginess: 'tired',
  sluggishness: 'tired',
  slowness: 'tired',
  heaviness: 'tired',
  weight: 'tired',
  burden: 'tired',
  load: 'tired',
  pressure: 'tired',

  // Pain aliases
  achy: 'sore',
  painful: 'sore',
  injured: 'sore',
  wounded: 'sore',
  damaged: 'sore',
  broken: 'sore',
  itchy: 'sore',
  scratchy: 'sore',
  inflamed: 'sore',
  puffy: 'sore',
  tight: 'sore',
  stiff: 'sore',
  rigid: 'sore',
  achiness: 'sore',
  pain: 'sore',
  injury: 'sore',
  wound: 'sore',
  damage: 'sore',
  brokenness: 'sore',
  itch: 'sore',
  scratchiness: 'sore',
  inflammation: 'sore',
  puffiness: 'sore',
  tightness: 'sore',
  stiffness: 'sore',
  rigidity: 'sore',

  // Illness aliases
  nauseous: 'sick',
  ill: 'sick',
  dizzy: 'sick',
  lightheaded: 'sick',
  woozy: 'sick',
  faint: 'sick',
  illness: 'sick',
  dizziness: 'sick',
  lightheadedness: 'sick',
  wooziness: 'sick',
  faintness: 'sick',

  // Moisture aliases
  damp: 'cold',
  moist: 'cold',
  wet: 'cold',
  dry: 'warm',
  parched: 'warm',
  dehydrated: 'warm',
  dampness: 'cold',
  moisture: 'cold',
  wetness: 'cold',
  dryness: 'warm',
  parch: 'warm',
  dehydration: 'warm',

  // Physical sensations
  distended: 'sore',
  expanded: 'sore',
  inflated: 'sore',
  enlarged: 'sore',
  distension: 'sore',
  expansion: 'sore',
  inflation: 'sore',
  enlargement: 'sore',

  // Common missing feeling words
  alone: 'lonely',
  stuck: 'frustrated',
  trapped: 'overwhelmed',
  hate: 'hateful',
  sorry: 'remorseful',
  letdown: 'disappointed',
  betrayed: 'hurt',
  loved: 'loving',
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
