export type MbStatCardTone = 'default' | 'soft' | 'warm' | 'inverse';
export type MbStatCardTrend = 'up' | 'down' | 'flat';

export interface MbStatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  caption?: string;
  tone?: MbStatCardTone;
  trend?: MbStatCardTrend;
  trendValue?: string;
  icon?: string;
  size?: 'md' | 'lg';
}
