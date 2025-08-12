// Basic profanity filter - expandable as needed
const PROFANITY_LIST = new Set([
  'fuck',
  'shit',
  'damn',
  'bitch',
  'asshole',
  'bastard',
  'crap',
  'piss',
  'dick',
  'cock',
  'pussy',
  'whore',
  'slut',
  'fag',
  'faggot',
  'retard',
  'nigger',
  'nigga',
  'cunt',
  'twat',
  // Add more as needed - keep it reasonable for global audience
]);

/**
 * Check if a word contains profanity
 */
export function containsProfanity(word: string): boolean {
  const normalizedWord = word.toLowerCase().trim();

  // Direct match
  if (PROFANITY_LIST.has(normalizedWord)) {
    return true;
  }

  // Check for profanity as substring (to catch variations)
  for (const profane of PROFANITY_LIST) {
    if (normalizedWord.includes(profane)) {
      return true;
    }
  }

  return false;
}

// Remove unused function
