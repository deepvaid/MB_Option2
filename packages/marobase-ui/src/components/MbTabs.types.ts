export type MbTabsIcon = 'none' | 'home' | 'rhombus' | 'more';

export interface MbTabItem {
  id: string;
  label: string;
  icon?: MbTabsIcon;
  badge?: number | string;
  dot?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export type MbTabsState = 'default' | 'hover' | 'focus' | 'disabled';
export type MbTabsVariant = 'pill' | 'line';
export type MbTabsOrientation = 'horizontal' | 'vertical';

export interface MbTabsProps {
  items: MbTabItem[];
  modelValue?: string;
  state?: MbTabsState;
  disabled?: boolean;
  ariaLabel?: string;
  variant?: MbTabsVariant;
  orientation?: MbTabsOrientation;
}

export interface MbTabsChangePayload {
  item: MbTabItem;
  index: number;
  event: MouseEvent | KeyboardEvent;
}
