import { Router, Request, Response } from 'express';
import { getSearchTerms } from '@worldfeel/shared/emotion-color-map';

const router = Router();

interface SearchRequest extends Request {
  query: {
    q?: string;
    limit?: string;
  };
}

router.get('/search', (req: SearchRequest, res: Response): void => {
  const q = (req.query.q || '').toString();
  const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : 20;
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 100)
    : 20;

  if (!q || q.trim().length === 0) {
    res.json({ success: true, data: [] });
    return;
  }

  const qn = q.toLowerCase().trim();
  const all = getSearchTerms();
  const prefix = all.filter((w) => w.startsWith(qn));
  const rest = all.filter((w) => !w.startsWith(qn) && w.includes(qn));
  const ranked = prefix.concat(rest);
  const deduped = Array.from(new Set(ranked)).slice(0, limit);
  res.json({ success: true, data: deduped });
});

export default router;
