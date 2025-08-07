export interface Submission {
  _id?: string;
  word: string;
  country?: string;
  region?: string;
  city?: string;
  ipHash: string;
  deviceId?: string;
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
  yourWord?: YourWordStats;
  colorHex: string;
  topPalette: string[];
}

export interface SubmissionRequest {
  word: string;
  country?: string;
  region?: string;
  city?: string;
  deviceId?: string;
}

export interface StatsQuery {
  country?: string;
  region?: string;
  city?: string;
  yourWord?: string;
}

export interface ColorResult {
  hex: string;
  shadeHex: string;
}

export interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse<T = any> {
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
