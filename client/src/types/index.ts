export interface CreativeScoring {
  status: 'winning' | 'watch' | 'fatigued' | 'low_spend';
  label: string;
  color: string;
}

export interface Creative {
  ad_id: string;
  ad_name: string;
  status: string;
  thumbnail_url: string | null;
  object_type: string | null;
  title: string;
  body: string;
  call_to_action_type: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
  frequency: number;
  reach: number;
  date_start: string | null;
  date_stop: string | null;
  scoring: CreativeScoring;
}

export interface SummaryData {
  totalSpend: number;
  avgCtr: number;
  avgRoas: number;
  avgCpc: number;
  topPerformer: Creative | null;
  worstPerformer: Creative | null;
  patterns: WinningPattern[];
  dateRange: DateRange;
}

export interface WinningPattern {
  category: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
}

export interface DateRange {
  since: string;
  until: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    dateRange: DateRange;
    cached: boolean;
  };
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type SortField = 'ad_name' | 'spend' | 'ctr' | 'cpc' | 'roas' | 'frequency' | 'impressions' | 'clicks';
export type SortDirection = 'asc' | 'desc';
