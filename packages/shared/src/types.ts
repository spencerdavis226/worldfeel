export interface Submission {
  _id?: string;
  word: string;
  ipHash: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface WordCount {
  word: string;
  count: number;
}

export interface YourWordStats extends WordCount {
  rank: number;
  percentile: number;
}

export interface Stats {
  total: number;
  top: WordCount;
  top5: WordCount[];
  top10?: WordCount[];
  yourWord?: YourWordStats;
  colorHex: string;
  topPalette: string[];
}

export interface SubmissionRequest {
  word: string;
}

export interface StatsQuery {
  yourWord?: string;
  deviceId?: string;
}

export interface ColorResult {
  hex: string;
  shadeHex: string;
  name: string;
  matched: boolean; // true if emotion matched from map, false if random fallback
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmissionResponse {
  success: boolean;
  data?: Stats;
  error?: string;
  message?: string;
  canEdit?: boolean;
  editWindowMinutes?: number;
}

export interface SubmitStatus {
  canSubmit: boolean;
  remainingSeconds: number;
  nextSubmitAt: string | null;
}
