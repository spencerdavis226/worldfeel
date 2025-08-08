import { Router, Request, Response } from 'express';
import {
  getSearchTerms,
  resolveEmotionKey,
} from '@worldfeel/shared/emotion-color-map';

const router = Router();

interface SearchRequest extends Request {
  query: {
    q?: string;
    limit?: string;
  };
}

// Lightweight Damerau–Levenshtein for short strings (flat DP to satisfy strict index checks)
function editDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const width = bl + 1;
  const size = (al + 1) * width;
  const dp = new Array<number>(size).fill(0);
  const idx = (i: number, j: number) => i * width + j;

  for (let i = 0; i <= al; i++) dp[idx(i, 0)] = i;
  for (let j = 0; j <= bl; j++) dp[idx(0, j)] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const ai = a.charAt(i - 1);
      const bj = b.charAt(j - 1);
      const aim1 = a.charAt(i - 1);
      const bim1 = b.charAt(j - 1);
      const aim2 = a.charAt(i - 2);
      const bim2 = b.charAt(j - 2);
      const cost = ai === bj ? 0 : 1;
      const deletion = (dp[idx(i - 1, j)] ?? Number.POSITIVE_INFINITY) + 1;
      const insertion = (dp[idx(i, j - 1)] ?? Number.POSITIVE_INFINITY) + 1;
      const substitution =
        (dp[idx(i - 1, j - 1)] ?? Number.POSITIVE_INFINITY) + cost;
      let best = Math.min(deletion, insertion, substitution);
      if (i > 1 && j > 1 && aim1 === bim2 && aim2 === bim1) {
        const transposition =
          (dp[idx(i - 2, j - 2)] ?? Number.POSITIVE_INFINITY) + 1;
        best = Math.min(best, transposition);
      }
      dp[idx(i, j)] = best;
    }
  }
  return dp[idx(al, bl)]!;
}

function looksAdjectiveLike(term: string): boolean {
  return /(?:ful|ous|ive|less|y|al|ic|ish|able|ible|ant|ent|ed|ing)$/.test(
    term
  );
}

function chooseDisplayLabel(labels: string[], fallback: string): string {
  const byShortest =
    labels.slice().sort((a, b) => a.length - b.length)[0] ?? fallback;
  const adjective = labels.find((l) => looksAdjectiveLike(l));
  let chosen = adjective ?? byShortest;
  if (labels.includes('peaceful')) chosen = 'peaceful';
  return chosen;
}

router.get('/search', (req: SearchRequest, res: Response): void => {
  const q = (req.query.q || '').toString();
  const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : 20;
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 100)
    : 20;

  const qn = q.toLowerCase().trim();
  if (!qn) {
    res.json({ success: true, data: [] });
    return;
  }

  // All searchable terms (canonical + aliases)
  const all = getSearchTerms();

  // Group all terms by canonical emotion key for dedupe + display selection
  const canonicalToLabels = new Map<string, string[]>();
  for (const term of all) {
    const ck = resolveEmotionKey(term);
    if (!ck) continue;
    const list = canonicalToLabels.get(ck) || [];
    list.push(term);
    canonicalToLabels.set(ck, list);
  }

  // Rank by prefix → substring → fuzzy (distance <= 2)
  const prefix = all.filter((w) => w.startsWith(qn));
  const substring = all.filter((w) => !w.startsWith(qn) && w.includes(qn));
  const fuzzy = all
    .filter((w) => !w.includes(qn) && editDistance(qn, w) <= 2)
    .sort((a, b) => editDistance(qn, a) - editDistance(qn, b));

  const ranked = [...prefix, ...substring, ...fuzzy];

  // Dedupe by canonical key and pick a human-friendly label (prefer canonical/adjective)
  const seenCanonical = new Set<string>();
  const results: string[] = [];

  // If the raw query resolves to a known canonical emotion (even via alias), surface it first
  const queryCanonical = resolveEmotionKey(qn);
  if (queryCanonical) {
    const labels = canonicalToLabels.get(queryCanonical) || [queryCanonical];
    // Prefer the canonical key itself if present among labels (ensures valid term)
    const chosen = labels.includes(queryCanonical)
      ? queryCanonical
      : chooseDisplayLabel(labels, queryCanonical);
    results.push(chosen);
    seenCanonical.add(queryCanonical);
  }
  for (const term of ranked) {
    const ck = resolveEmotionKey(term);
    if (!ck || seenCanonical.has(ck)) continue;
    const labels = canonicalToLabels.get(ck) || [term];
    const chosen = labels.includes(ck) ? ck : chooseDisplayLabel(labels, term);

    results.push(chosen);
    seenCanonical.add(ck);
    if (results.length >= limit) break;
  }

  res.json({ success: true, data: results });
});

export default router;
