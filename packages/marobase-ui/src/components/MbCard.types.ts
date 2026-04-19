export type MbCardTone = 'default' | 'soft' | 'warm' | 'inverse';
export type MbCardRadius = 'sm' | 'md' | 'lg' | 'xl';
export type MbCardPadding = 'sm' | 'md' | 'lg';

export interface MbCardProps {
  tone?: MbCardTone;
  radius?: MbCardRadius;
  padding?: MbCardPadding;
  interactive?: boolean;
  as?: string;
}
